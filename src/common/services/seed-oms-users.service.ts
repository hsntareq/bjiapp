import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Organization, OrgPosition, Role } from '../entities';
import { User } from '../../users/user.entity';
import { UserPayment } from '../../users/user-payment.entity';

@Injectable()
export class SeedOmsUsersService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(OrgPosition)
    private positionRepo: Repository<OrgPosition>,
    @InjectRepository(UserPayment)
    private paymentRepo: Repository<UserPayment>,
  ) {}

  private async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  private async getOrCreateOrg(name: string, type: string, parent?: Organization): Promise<Organization> {
    let org = await this.orgRepo.findOne({ where: { name, type } as any });
    if (!org) {
      org = this.orgRepo.create({
        name,
        type,
        parent: parent || null,
        parentId: parent?.id || null,
        division: 'Dhaka',
        city: 'Dhaka',
      } as any) as unknown as Organization;
      org = await this.orgRepo.save(org);
    }
    return org;
  }

  private async getOrCreateRole(name: string, org: Organization): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { name, organizationId: org.id } });
    if (!role) {
      role = this.roleRepo.create({ name, description: name, organization: org } as any) as unknown as Role;
      role = await this.roleRepo.save(role);
    }
    return role;
  }

  private async createOmsUser(params: {
    email: string;
    fullname: string;
    org: Organization;
    role: Role;
    rank: string;
    isAdv?: boolean;
    position?: string;
  }): Promise<User> {
    let user = await this.userRepo.findOne({ where: { email: params.email } });
    if (!user) {
      user = this.userRepo.create({
        email: params.email,
        password: await this.hash(params.email),
      } as any) as unknown as User;
    } else {
      // Always keep password in sync with email
      (user as any).password = await this.hash(params.email);
    }

    const u = user!;
    Object.assign(u, {
      fullname: params.fullname,
      name: params.fullname,
      organization: params.org,
      organizationId: params.org.id,
      role: params.role,
      roleId: params.role.id,
      rank: params.rank.toLowerCase(),
      isAdv: params.isAdv ?? false,
      isActive: true,
      // Adding/Updating dummy info
      phone: u.phone || "01" + Math.floor(Math.random() * 900000000 + 100000000).toString(),
      monthlyBaitulmalAmount: u.monthlyBaitulmalAmount || Math.floor(Math.random() * 500) + 100,
      yearlyDonationAmount: u.yearlyDonationAmount || Math.floor(Math.random() * 5000) + 1000,
      knowledgebaseId: u.knowledgebaseId || Math.floor(Math.random() * 100) + 1,
      academicQualifications: (() => {
        const existing = u.academicQualifications;
        // If already has subject field, keep it; otherwise regenerate with subject
        if (existing && existing.length > 0 && existing[0].subject) return existing;
        const degreeOptions = [
          { degree: "M.Sc", subject: "Computer Science", institution: "BUET", yearOffset: 3 },
          { degree: "MA", subject: "Islamic Studies", institution: "National University", yearOffset: 3 },
          { degree: "MBA", subject: "Management", institution: "BRAC University", yearOffset: 2 },
          { degree: "M.Phill", subject: "Political Science", institution: "University of Dhaka", yearOffset: 3 },
        ];
        const bachelorOptions = [
          { degree: "B.Sc", subject: "CSE", institution: "BUBT" },
          { degree: "B.Sc", subject: "EEE", institution: "BUET" },
          { degree: "BBA", subject: "Business Administration", institution: "BRAC University" },
          { degree: "BA", subject: "Political Science", institution: "University of Dhaka" },
          { degree: "MBBS", subject: "Medicine", institution: "Dhaka Medical College" },
        ];
        const bYear = 2008 + Math.floor(Math.random() * 9); // 2008–2016
        const b = bachelorOptions[Math.floor(Math.random() * bachelorOptions.length)];
        const m = degreeOptions[Math.floor(Math.random() * degreeOptions.length)];
        return [
          { degree: m.degree, subject: m.subject, institution: m.institution, year: String(bYear + m.yearOffset + 2) },
          { degree: b.degree, subject: b.subject, institution: b.institution, year: String(bYear) },
        ];
      })(),
      address: u.address || "House " + (Math.floor(Math.random() * 100) + 1) + ", Road " + (Math.floor(Math.random() * 20) + 1) + ", Dhaka",
      nid: u.nid || Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
      photo: u.photo || `profile_${params.email.split('@')[0]}.jpg`,
      jobTitle: u.jobTitle || (() => {
        const jobs = [
          { title: "Web Developer", org: "Ollyo" },
          { title: "Software Engineer", org: "Pathao" },
          { title: "Senior Developer", org: "Shajgoj" },
          { title: "Teacher", org: "Ideal School & College" },
          { title: "Professor", org: "BUET" },
          { title: "Medical Officer", org: "Dhaka Medical College Hospital" },
          { title: "Assistant Director", org: "Ministry of Finance" },
          { title: "Bank Officer", org: "Islami Bank Bangladesh" },
          { title: "Business Owner", org: "Self Employed" },
          { title: "Lawyer", org: "Supreme Court of Bangladesh" },
          { title: "Accountant", org: "KPMG Bangladesh" },
          { title: "Civil Engineer", org: "LGED" },
        ];
        const j = jobs[Math.floor(Math.random() * jobs.length)];
        (u as any).__jobOrg = j.org;
        return j.title;
      })(),
      jobOrganization: u.jobOrganization || (u as any).__jobOrg || "Self Employed",
      officeAddress: u.officeAddress || "Office " + (Math.floor(Math.random() * 50) + 1) + ", " + ["Motijheel", "Gulshan", "Dhanmondi", "Mirpur", "Uttara"][Math.floor(Math.random() * 5)] + ", Dhaka",
    });

    user = await this.userRepo.save(u);

    // Force update financial fields using save on plain object with id
    await this.userRepo.save({
      id: user.id,
      isMonthlyBaitulmalPaid: Math.random() > 0.3,
      yearlyDonationPaid: Math.floor(Math.random() * (user.yearlyDonationAmount || 1000)),
    } as any);

    // Seed some detailed UserPayments for 2024 (Jan to May)
    const currentYear = 2024;
    for (let month = 1; month <= 5; month++) {
      let payment = await this.paymentRepo.findOne({ where: { userId: user.id, year: currentYear, month } });
      if (!payment) {
        const isPaid = Math.random() > 0.2;
        const nisab = user.monthlyBaitulmalAmount || 200;
        payment = this.paymentRepo.create({
          userId: user.id,
          year: currentYear,
          month,
          allocatedNisab: nisab,
          directIanat: isPaid ? nisab : 0,
          oneTime: Math.random() > 0.8 ? 500 : 0,
          electionFund: Math.random() > 0.9 ? 1000 : 0,
          totalPaid: isPaid ? nisab : 0,
        } as any) as unknown as UserPayment;
        await this.paymentRepo.save(payment);
      }
    }
    
    // Seed some detailed UserPayments for 2023
    for (let month = 1; month <= 12; month++) {
      let payment = await this.paymentRepo.findOne({ where: { userId: user.id, year: 2023, month } });
      if (!payment) {
        const isPaid = Math.random() > 0.1;
        const nisab = user.monthlyBaitulmalAmount || 200;
        payment = this.paymentRepo.create({
          userId: user.id,
          year: 2023,
          month,
          allocatedNisab: nisab,
          directIanat: isPaid ? nisab : 0,
          totalPaid: isPaid ? nisab : 0,
        } as any) as unknown as UserPayment;
        await this.paymentRepo.save(payment);
      }
    }

    if (params.position) {
      const existingPos = await this.positionRepo.findOne({
        where: { organizationId: params.org.id, userId: user.id } as any,
      });
      if (!existingPos) {
        const pos = this.positionRepo.create({
          organizationId: params.org.id,
          userId: user.id,
          positionTitle: params.position,
          positionGroup: 'EXECUTIVE',
          isActive: true,
        } as any);
        await this.positionRepo.save(pos as any);
      }
    }

    return user;
  }

  async seed() {
    console.log('🌱 Starting OMS Users seed...');

    const centralOrg = await this.getOrCreateOrg('BJI OMS Central', 'CENTRAL');
    const centralRole = await this.getOrCreateRole('Central Admin', centralOrg);

    // 1. Cities
    const cityOrgs: Organization[] = [];
    for (let i = 1; i <= 9; i++) {
      const org = await this.getOrCreateOrg(`City ${i}`, 'CITY', centralOrg);
      cityOrgs.push(org);
      const role = await this.getOrCreateRole(`City Officer - City ${i}`, org);
      await this.createOmsUser({
        email: `city${i}@oms.com`,
        fullname: `City ${i} President`,
        org,
        role,
        rank: 'Member',
        position: 'President',
      });
    }

    // 2. Thana (under City 1)
    const thana1Org = await this.getOrCreateOrg('Thana 1', 'THANA', cityOrgs[0]);
    const thana1Role = await this.getOrCreateRole('Thana Officer - Thana 1', thana1Org);
    await this.createOmsUser({
      email: 'thana1@oms.com',
      fullname: 'Thana 1 President',
      org: thana1Org,
      role: thana1Role,
      rank: 'Member',
      position: 'President',
    });

    // 3. Wards (under Thana 1)
    const wardOrgs: Organization[] = [];
    for (let i = 1; i <= 9; i++) {
      const org = await this.getOrCreateOrg(`Ward ${i}`, 'WARD', thana1Org);
      wardOrgs.push(org);
      const role = await this.getOrCreateRole(`Ward Coordinator - Ward ${i}`, org);
      await this.createOmsUser({
        email: `ward${i}@oms.com`,
        fullname: `Ward ${i} President`,
        org,
        role,
        rank: 'Member',
        position: 'President',
      });

      // 4. Units (under each Ward)
      for (let j = 1; j <= 4; j++) {
        const unitId = `${i}${j}`;
        const unitOrg = await this.getOrCreateOrg(`Unit ${unitId}`, 'UNIT', org);
        const unitRole = await this.getOrCreateRole(`Unit Member - Unit ${unitId}`, unitOrg);
        
        // Unit President
        await this.createOmsUser({
          email: `unit${unitId}@oms.com`,
          fullname: `Unit ${unitId} President`,
          org: unitOrg,
          role: unitRole,
          rank: 'Member',
          position: 'President',
        });

        // Unit Workers (Kormis)
        const kormis = [
          { email: `kormi${unitId}1@oms.com`, pos: 'Secretary' },
          { email: `kormi${unitId}2@oms.com`, pos: 'Office' },
          { email: `kormi${unitId}3@oms.com`, pos: 'Baitulmal' },
          { email: `kormi${unitId}4@oms.com`, pos: 'Member' },
        ];
        
        // Special case for wardX: unitXY names from user request
        // The user provided specific names like kormi11, kormo12, kormi13, kormi14 for unit11
        // I'll adjust the logic to match their exact request if possible
        
        const userRequestedKormis = this.getKormisForUnit(i, j);
        
        for (let k = 0; k < userRequestedKormis.length; k++) {
          const kEmail = userRequestedKormis[k];
          const kPos = k === 0 ? 'Secretary' : k === 1 ? 'Office' : k === 2 ? 'Baitulmal' : 'Member';
          await this.createOmsUser({
            email: kEmail,
            fullname: kEmail.split('@')[0],
            org: unitOrg,
            role: unitRole,
            rank: 'Activist',
            isAdv: true,
            position: kPos,
          });
        }
      }
    }

    // Example: Assign City 1 President to also be a 'Member' of City 2 for demo purposes
    const city1User = await this.userRepo.findOne({ where: { email: 'city1@oms.com' } });
    if (city1User && cityOrgs[1]) {
      const existingPos = await this.positionRepo.findOne({
        where: { organizationId: cityOrgs[1].id, userId: city1User.id } as any,
      });
      if (!existingPos) {
        const pos = this.positionRepo.create({
          organizationId: cityOrgs[1].id,
          userId: city1User.id,
          positionTitle: 'Member',
          positionGroup: 'SHURA',
          isActive: true,
        } as any);
        await this.positionRepo.save(pos as any);
      }
    }

    console.log('✅ OMS Users seed completed!');
  }

  private getKormisForUnit(wardIdx: number, unitIdx: number): string[] {
    // Logic to match the user's specific request
    // ward1: unit11@oms.com (kormi11@oms.com, kormo12@oms.com, kormi13@oms.com, kormi14@oms.com), ...
    // ward2: unit21@oms.com (kormi21@oms.com, kormo22@oms.com, kormi23@oms.com, kormi24@oms.com), ...
    
    const k1 = `kormi${wardIdx}${unitIdx === 1 ? '' : unitIdx}${unitIdx === 1 ? unitIdx : '1'}@oms.com`;
    // Wait, the user's pattern is tricky:
    // ward1: unit11 (kormi11, kormo12, kormi13, kormi14)
    // ward1: unit12 (kormi121, kormi122, kormi123, kormi124)
    
    if (unitIdx === 1) {
      return [
        `kormi${wardIdx}1@oms.com`,
        `kormo${wardIdx}2@oms.com`,
        `kormi${wardIdx}3@oms.com`,
        `kormi${wardIdx}4@oms.com`,
      ];
    } else {
      return [
        `kormi${wardIdx}${unitIdx}1@oms.com`,
        `kormi${wardIdx}${unitIdx}2@oms.com`,
        `kormi${wardIdx}${unitIdx}3@oms.com`,
        `kormi${wardIdx}${unitIdx}4@oms.com`,
      ];
    }
  }
}
