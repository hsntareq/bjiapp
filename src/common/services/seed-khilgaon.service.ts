import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Organization, OrgPosition, Role } from '../entities';
import { User } from '../../users/user.entity';

// Random first and last names for realistic data
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
    canCreateUsers?: boolean;
  }): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: params.email } });
    if (existing) return existing;
    const user = this.userRepo.create({
      email: params.email,
      password: await this.hash(params.email),
      name: params.name,
      organization: params.org,
      role: params.role,
      rank: params.rank,
      canCreateUsers: params.canCreateUsers ?? false,
    });
    return this.userRepo.save(user);
  }

  private async createPosition(org: Organization, user: User, positionTitle: string, group: string): Promise<OrgPosition> {
    const pos = this.positionRepo.create({
      organizationId: org.id,
      userId: user.id,
      positionTitle,
      positionGroup: group,
      isActive: true,
    } as any);
    return this.positionRepo.save(pos as any);
  }

  private async getOrCreateRole(name: string, org: Organization): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { name } });
    if (!role) {
      role = this.roleRepo.create({ name, description: name, organization: org } as any);
      role = await this.roleRepo.save(role);
    }
    return role;
  }

  async seed() {
    console.log('🌱 Seeding Khilgaon North hierarchy...\n');

    // ── Find or create Thana ──────────────────────────────────────────────────
    let thanaOrg = await this.orgRepo.findOne({ where: { name: 'Khilgaon North' } });
    if (!thanaOrg) {
      // Find a city parent (Dhaka) or any CITY level org
      const parent = await this.orgRepo.findOne({ where: { type: 'CITY' } });
      thanaOrg = this.orgRepo.create({
        name: 'Khilgaon North',
        type: 'THANA',
        division: 'Dhaka',
        city: 'Dhaka',
        thana: 'Khilgaon',
        parent: parent ?? undefined,
      } as any);
      thanaOrg = await this.orgRepo.save(thanaOrg);
      console.log('  ✓ Created Thana: Khilgaon North');
    }

    const thanaRole = await this.getOrCreateRole('Thana Executive - Khilgaon North', thanaOrg);

    const thanaPositions: { slug: string; title: string; rank: string; group: string; canCreate: boolean }[] = [
      { slug: 'president',    title: 'President',       rank: 'member',   group: 'EXECUTIVE', canCreate: true  },
      { slug: 'secretary',    title: 'Secretary',       rank: 'member',   group: 'EXECUTIVE', canCreate: true  },
      { slug: 'office',       title: 'Office Secretary',rank: 'member',   group: 'EXECUTIVE', canCreate: false },
      { slug: 'baitulmal',    title: 'Baitulmal',       rank: 'member',   group: 'EXECUTIVE', canCreate: false },
      { slug: 'shangothonik', title: 'Shangothonik',    rank: 'activist', group: 'EXECUTIVE', canCreate: false },
      { slug: 'member1',      title: 'Member',          rank: 'activist', group: 'EXECUTIVE', canCreate: false },
    ];

    console.log('  Creating Thana users...');
    for (const p of thanaPositions) {
      const email = `thana-khilgaon-${p.slug}@bjioms.com`;
      const name = p.slug.startsWith('member') ? nextName() : this.titleToName(p.title) + ' (Khilgaon)';
      const user = await this.createUser({ email, name, org: thanaOrg, role: thanaRole, rank: p.rank, canCreateUsers: p.canCreate });
      await this.createPosition(thanaOrg, user, p.title, p.group);
      console.log(`    ✓ ${p.title}: ${email}`);
    }

    // ── Ward: Jubo Ward ───────────────────────────────────────────────────────
    let wardOrg = await this.orgRepo.findOne({ where: { name: 'Jubo Ward' } });
    if (!wardOrg) {
      wardOrg = this.orgRepo.create({
        name: 'Jubo Ward',
        type: 'WARD',
        division: 'Dhaka',
        city: 'Dhaka',
        thana: 'Khilgaon',
        wardNumber: 1,
        parent: thanaOrg,
      } as any);
      wardOrg = await this.orgRepo.save(wardOrg);
      console.log('  ✓ Created Ward: Jubo Ward');
    }

    const wardRole = await this.getOrCreateRole('Ward Executive - Jubo Ward', wardOrg);

    const wardPositions = [
      { slug: 'president',    title: 'President',       rank: 'member',   group: 'EXECUTIVE', canCreate: true  },
      { slug: 'secretary',    title: 'Secretary',       rank: 'member',   group: 'EXECUTIVE', canCreate: true  },
      { slug: 'office',       title: 'Office Secretary',rank: 'member',   group: 'EXECUTIVE', canCreate: false },
      { slug: 'baitulmal',    title: 'Baitulmal',       rank: 'member',   group: 'EXECUTIVE', canCreate: false },
      { slug: 'shangothonik', title: 'Shangothonik',    rank: 'activist', group: 'EXECUTIVE', canCreate: false },
      { slug: 'member1',      title: 'Member',          rank: 'activist', group: 'EXECUTIVE', canCreate: false },
    ];

    let wardUser: User | null = null;
    console.log('  Creating Ward users...');
    for (const p of wardPositions) {
      const email = `ward-jubo-${p.slug}@bjioms.com`;
      const name = p.slug.startsWith('member') ? nextName() : this.titleToName(p.title) + ' (Jubo Ward)';
      const user = await this.createUser({ email, name, org: wardOrg, role: wardRole, rank: p.rank, canCreateUsers: p.canCreate });
      await this.createPosition(wardOrg, user, p.title, p.group);
      if (p.slug === 'president') wardUser = user;
      console.log(`    ✓ ${p.title}: ${email}`);
    }

    // ── Units ─────────────────────────────────────────────────────────────────
    const units = [
      { slug: 'ansarbag',       name: 'Ansarbag' },
      { slug: '3-west',         name: '3 West' },
      { slug: 'banasree-north', name: 'Banasree North' },
      { slug: '3-mid',          name: '3 Mid' },
      { slug: 'protik-jubo',    name: 'Protik Jubo' },
    ];

    for (const unitDef of units) {
      let unitOrg = await this.orgRepo.findOne({ where: { name: unitDef.name } });
      if (!unitOrg) {
        unitOrg = this.orgRepo.create({
          name: unitDef.name,
          type: 'UNIT',
          division: 'Dhaka',
          city: 'Dhaka',
          thana: 'Khilgaon',
          wardNumber: 1,
          parent: wardOrg,
        } as any);
        unitOrg = await this.orgRepo.save(unitOrg);
        console.log(`  ✓ Created Unit: ${unitDef.name}`);
      }

      const unitRole = await this.getOrCreateRole(`Unit Member - ${unitDef.name}`, unitOrg);

      // President → rank: member
      const presidentEmail = `unit-${unitDef.slug}-president@bjioms.com`;
      const president = await this.createUser({
        email: presidentEmail,
        name: `${unitDef.name} President`,
        org: unitOrg,
        role: unitRole,
        rank: 'member',
        canCreateUsers: false,
      });
      await this.createPosition(unitOrg, president, 'President', 'EXECUTIVE');

      // Secretary → rank: activist (nominated)
      const secretaryEmail = `unit-${unitDef.slug}-secretary@bjioms.com`;
      const secretary = await this.createUser({
        email: secretaryEmail,
        name: `${unitDef.name} Secretary`,
        org: unitOrg,
        role: unitRole,
        rank: 'activist',
        canCreateUsers: false,
      });
      await this.createPosition(unitOrg, secretary, 'Secretary', 'EXECUTIVE');

      // Additional activist members (total activists = 6-10, president is the 1 member, secretary is activist)
      const numActivists = randInt(4, 8); // more activists (secretary already counted)
      for (let i = 1; i <= numActivists; i++) {
        const email = `unit-${unitDef.slug}-activist${i}@bjioms.com`;
        await this.createUser({ email, name: nextName(), org: unitOrg, role: unitRole, rank: 'activist' });
      }

      // Associates (15-20 total, 5 = adv-associate, rest = associate)
      const numAssociates = randInt(15, 20);
      for (let i = 1; i <= numAssociates; i++) {
        const rank = i <= 5 ? 'adv-associate' : 'associate';
        const email = `unit-${unitDef.slug}-assoc${i}@bjioms.com`;
        await this.createUser({ email, name: nextName(), org: unitOrg, role: unitRole, rank });
      }

      console.log(`    ✓ Unit ${unitDef.name}: 1 member, ${numActivists + 1} activists, ${numAssociates} associates (5 adv)`);
    }

    console.log('\n✅ Khilgaon seed completed!');
    console.log('\n📝 Key credentials:');
    console.log('  Thana President: thana-khilgaon-president@bjioms.com');
    console.log('  Ward Secretary:  ward-jubo-secretary@bjioms.com');
    console.log('  Unit Ansarbag:   unit-ansarbag-president@bjioms.com');
  }

  private titleToName(title: string): string {
    const map: Record<string, string> = {
      President: 'Mohammad Fahim',
      Secretary: 'Abdul Wahab',
      'Office Secretary': 'Shuaib Noman',
      Baitulmal: 'Tawfiq Hasan',
      Shangothonik: 'Rafiqul Islam',
    };
    return map[title] ?? title;
  }
}
