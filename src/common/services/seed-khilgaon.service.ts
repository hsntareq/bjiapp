import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Organization, OrgPosition, Role } from '../entities';
import { User } from '../../users/user.entity';

const FIRST_NAMES = [
  'Abu Bakr', 'Umar', 'Uthman', 'Ali', 'Khalid', 'Bilal', 'Salman', 'Abdullah',
  'Ibrahim', 'Ismail', 'Yusuf', 'Dawud', 'Sulaiman', 'Musa', 'Harun', 'Isa',
  'Rafiq', 'Jamal', 'Kamal', 'Nabil', 'Tariq', 'Yasir', 'Zayd', 'Hamza',
  'Anas', 'Jaber', 'Saad', 'Talha', 'Zubair', 'Muaz',
];
const LAST_NAMES = [
  'Hossain', 'Rahman', 'Islam', 'Ahmed', 'Khan', 'Mia', 'Chowdhury', 'Sheikh',
  'Alam', 'Bhuiyan', 'Sarkar', 'Mondal', 'Patowary', 'Talukder', 'Noor',
  'Siddique', 'Faruq', 'Ansari', 'Rashid', 'Karim',
];

let nameIdx = 0;
function nextName(): string {
  const first = FIRST_NAMES[nameIdx % FIRST_NAMES.length];
  const last = LAST_NAMES[Math.floor(nameIdx / FIRST_NAMES.length) % LAST_NAMES.length];
  nameIdx++;
  return `${first} ${last}`;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable()
export class SeedKhilgaonService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(OrgPosition)
    private positionRepo: Repository<OrgPosition>,
  ) {}

  private async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  private async createUser(params: {
    email: string;
    name: string;
    org: any;
    role: any;
    rank: string;
    isAdv?: boolean;
    canCreateUsers?: boolean;
  }): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: params.email } });
    if (existing) {
      // Update rank + isAdv in case seed is re-run
      (existing as any).rank = params.rank;
      (existing as any).isAdv = params.isAdv ?? false;
      return this.userRepo.save(existing);
    }
    const user = this.userRepo.create({
      email: params.email,
      password: await this.hash(params.email),
      name: params.name,
      organization: params.org,
      role: params.role,
      rank: params.rank,
      isAdv: params.isAdv ?? false,
      canCreateUsers: params.canCreateUsers ?? false,
    } as any) as unknown as User;
    return this.userRepo.save(user);
  }

  private async createPosition(org: Organization, user: User, positionTitle: string, group: string): Promise<void> {
    // Already linked to this user — nothing to do
    const existingForUser = await this.positionRepo.findOne({
      where: { organizationId: org.id, userId: user.id } as any,
    });
    if (existingForUser) return;

    // Reuse a vacant slot with the same title rather than creating a duplicate
    const vacantSlot = await this.positionRepo.findOne({
      where: { organizationId: org.id, positionTitle, userId: null } as any,
    });
    if (vacantSlot) {
      (vacantSlot as any).userId = user.id;
      (vacantSlot as any).isActive = true;
      await this.positionRepo.save(vacantSlot as any);
      return;
    }

    const pos = this.positionRepo.create({
      organizationId: org.id,
      userId: user.id,
      positionTitle,
      positionGroup: group,
      isActive: true,
    } as any);
    await this.positionRepo.save(pos as any);
  }

  private async getOrCreateRole(name: string, org: Organization): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { name } });
    if (!role) {
      role = this.roleRepo.create({ name, description: name, organization: org } as any) as unknown as Role;
      role = await this.roleRepo.save(role);
    }
    return role;
  }

  /** Migrate legacy adv-* ranks to base rank + isAdv=true */
  private async migrateAdvRanks(): Promise<void> {
    await this.userRepo.query(
      `UPDATE users SET rank = 'associate', is_adv = true WHERE rank = 'adv-associate'`,
    );
    await this.userRepo.query(
      `UPDATE users SET rank = 'activist', is_adv = true WHERE rank = 'adv-activist'`,
    );
    console.log('  ✓ Migrated adv-associate → associate+isAdv and adv-activist → activist+isAdv');
  }

  /** Rename old unit names that conflict with new ward names */
  private async migrateOrgNames(): Promise<void> {
    await this.orgRepo.query(
      `UPDATE organizations SET name = 'Jubo Banasree North' WHERE name = 'Banasree North' AND type = 'UNIT'`,
    );
    console.log('  ✓ Renamed conflicting unit names');
  }

  async seed() {
    nameIdx = 0;
    console.log('🌱 Seeding Khilgaon North hierarchy...\n');

    await this.migrateAdvRanks();
    await this.migrateOrgNames();

    // ── Thana: Khilgaon North ─────────────────────────────────────────────────
    let thanaOrg = await this.orgRepo.findOne({ where: { name: 'Khilgaon North' } });
    if (!thanaOrg) {
      const parent = await this.orgRepo.findOne({ where: { type: 'CITY' } });
      thanaOrg = this.orgRepo.create({
        name: 'Khilgaon North',
        type: 'THANA',
        division: 'Dhaka',
        city: 'Dhaka',
        thana: 'Khilgaon',
        parent: parent ?? undefined,
      } as any) as unknown as Organization;
      thanaOrg = await this.orgRepo.save(thanaOrg);
      console.log('  ✓ Created Thana: Khilgaon North');
    }

    const thanaRole = await this.getOrCreateRole('Thana Executive - Khilgaon North', thanaOrg);

    // Thana: 4 positional users (president, secretary, office secretary, baitulmal)
    const thanaPositions: { slug: string; title: string; rank: string; canCreate: boolean }[] = [
      { slug: 'president',    title: 'President',        rank: 'member', canCreate: true  },
      { slug: 'secretary',    title: 'Secretary',        rank: 'member', canCreate: true  },
      { slug: 'office',       title: 'Office Secretary', rank: 'member', canCreate: false },
      { slug: 'baitulmal',    title: 'Baitulmal',        rank: 'member', canCreate: false },
    ];

    console.log('  Creating Thana users...');
    for (const p of thanaPositions) {
      const email = `thana-khilgaon-${p.slug}@bjioms.com`;
      const name = this.titleToName(p.title, 'Khilgaon');
      const user = await this.createUser({ email, name, org: thanaOrg, role: thanaRole, rank: p.rank, canCreateUsers: p.canCreate });
      await this.createPosition(thanaOrg, user, p.title, 'EXECUTIVE');
      console.log(`    ✓ ${p.title}: ${email}`);
    }

    // ── Jubo Ward ─────────────────────────────────────────────────────────────
    await this.seedWard({
      wardName:  'Jubo Ward',
      wardSlug:  'jubo',
      wardNumber: 1,
      thanaOrg,
      units: [
        { slug: 'ansarbag',       name: 'Ansarbag' },
        { slug: '3-west',         name: '3 West' },
        { slug: 'jubo-banasree',  name: 'Jubo Banasree North' },
        { slug: '3-mid',          name: '3 Mid' },
        { slug: 'protik-jubo',    name: 'Protik Jubo' },
      ],
    });

    // ── 3 East Ward ────────────────────────────────────────────────────────────
    await this.seedWard({
      wardName:  '3 East',
      wardSlug:  '3-east',
      wardNumber: 2,
      thanaOrg,
      units: [
        { slug: '3east-a', name: 'Merul Badda' },
        { slug: '3east-b', name: 'Rayer Bag' },
        { slug: '3east-c', name: 'Khilgaon Colony' },
      ],
    });

    // ── Banasree North Ward ────────────────────────────────────────────────────
    await this.seedWard({
      wardName:  'Banasree North',
      wardSlug:  'banasree-north',
      wardNumber: 3,
      thanaOrg,
      units: [
        { slug: 'bn-a', name: 'Banasree Block A' },
        { slug: 'bn-b', name: 'Banasree Block B' },
        { slug: 'bn-c', name: 'Banasree Block C' },
      ],
    });

    // ── Goran Ward ─────────────────────────────────────────────────────────────
    await this.seedWard({
      wardName:  'Goran',
      wardSlug:  'goran',
      wardNumber: 4,
      thanaOrg,
      units: [
        { slug: 'goran-north', name: 'Goran North' },
        { slug: 'goran-south', name: 'Goran South' },
        { slug: 'tikkatuli',   name: 'Tikkatuli' },
      ],
    });

    console.log('\n✅ Khilgaon seed completed!');
    console.log('\n📝 Key credentials:');
    console.log('  Thana President:  thana-khilgaon-president@bjioms.com');
    console.log('  Thana Secretary:  thana-khilgaon-secretary@bjioms.com');
    console.log('  Ward Secretary:   ward-jubo-secretary@bjioms.com');
    console.log('  Unit Ansarbag:    unit-ansarbag-president@bjioms.com');
  }

  private async seedWard(params: {
    wardName: string;
    wardSlug: string;
    wardNumber: number;
    thanaOrg: Organization;
    units: { slug: string; name: string }[];
  }): Promise<void> {
    const { wardName, wardSlug, wardNumber, thanaOrg, units } = params;

    let wardOrg = await this.orgRepo.findOne({ where: { name: wardName, type: 'WARD' } as any });
    if (!wardOrg) {
      wardOrg = this.orgRepo.create({
        name: wardName,
        type: 'WARD',
        division: 'Dhaka',
        city: 'Dhaka',
        thana: 'Khilgaon',
        wardNumber,
        parent: thanaOrg,
      } as any) as unknown as Organization;
      wardOrg = await this.orgRepo.save(wardOrg);
      console.log(`  ✓ Created Ward: ${wardName}`);
    }

    const wardRole = await this.getOrCreateRole(`Ward Executive - ${wardName}`, wardOrg);

    const wardPositions = [
      { slug: 'president', title: 'President',        rank: 'member', canCreate: true  },
      { slug: 'secretary', title: 'Secretary',        rank: 'member', canCreate: true  },
      { slug: 'office',    title: 'Office Secretary', rank: 'member', canCreate: false },
      { slug: 'baitulmal', title: 'Baitulmal',        rank: 'member', canCreate: false },
    ];

    console.log(`  Creating Ward users for ${wardName}...`);
    for (const p of wardPositions) {
      const email = `ward-${wardSlug}-${p.slug}@bjioms.com`;
      const name = this.titleToName(p.title, wardName);
      const user = await this.createUser({ email, name, org: wardOrg, role: wardRole, rank: p.rank, canCreateUsers: p.canCreate });
      await this.createPosition(wardOrg, user, p.title, 'EXECUTIVE');
      console.log(`    ✓ ${p.title}: ${email}`);
    }

    for (const unitDef of units) {
      let unitOrg = await this.orgRepo.findOne({ where: { name: unitDef.name, type: 'UNIT' } as any });
      if (!unitOrg) {
        unitOrg = this.orgRepo.create({
          name: unitDef.name,
          type: 'UNIT',
          division: 'Dhaka',
          city: 'Dhaka',
          thana: 'Khilgaon',
          wardNumber,
          parent: wardOrg,
        } as any) as unknown as Organization;
        unitOrg = await this.orgRepo.save(unitOrg);
        console.log(`  ✓ Created Unit: ${unitDef.name}`);
      }

      const unitRole = await this.getOrCreateRole(`Unit Member - ${unitDef.name}`, unitOrg);

      // President → rank: member
      const presidentEmail = `unit-${unitDef.slug}-president@bjioms.com`;
      const president = await this.createUser({
        email: presidentEmail,
        name: `${unitDef.name} President`,
        org: unitOrg, role: unitRole, rank: 'member', canCreateUsers: false,
      });
      await this.createPosition(unitOrg, president, 'President', 'EXECUTIVE');

      // Secretary → rank: activist
      const secretaryEmail = `unit-${unitDef.slug}-secretary@bjioms.com`;
      const secretary = await this.createUser({
        email: secretaryEmail,
        name: `${unitDef.name} Secretary`,
        org: unitOrg, role: unitRole, rank: 'activist', canCreateUsers: false,
      });
      await this.createPosition(unitOrg, secretary, 'Secretary', 'EXECUTIVE');

      // Additional activists: 1-2 (total unit max ~10)
      const numActivists = randInt(1, 2);
      for (let i = 1; i <= numActivists; i++) {
        const email = `unit-${unitDef.slug}-activist${i}@bjioms.com`;
        await this.createUser({ email, name: nextName(), org: unitOrg, role: unitRole, rank: 'activist' });
      }

      // Associates: 3-5 total (first 2 are adv)
      const numAssociates = randInt(3, 5);
      for (let i = 1; i <= numAssociates; i++) {
        const isAdv = i <= 2;
        const email = `unit-${unitDef.slug}-assoc${i}@bjioms.com`;
        await this.createUser({ email, name: nextName(), org: unitOrg, role: unitRole, rank: 'associate', isAdv });
      }

      const total = 2 + numActivists + numAssociates;
      console.log(`    ✓ Unit ${unitDef.name}: 1 member + ${numActivists + 1} activists + ${numAssociates} associates (2 adv) = ${total} persons`);
    }
  }

  private titleToName(title: string, orgName: string): string {
    const map: Record<string, string> = {
      President:          'Mohammad Fahim',
      Secretary:          'Abdul Wahab',
      'Office Secretary': 'Shuaib Noman',
      Baitulmal:          'Tawfiq Hasan',
    };
    return `${map[title] ?? title} (${orgName})`;
  }
}
