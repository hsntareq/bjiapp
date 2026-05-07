import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { 
  Organization, 
  OrganizationLevel, 
  Position, 
  Permission, 
  RolePermission,
  OrganizationPositionAssignment
} from '../entities';
import { User } from '../../users/user.entity';

@Injectable()
export class HierarchicalSeedService {
  constructor(
    @InjectRepository(OrganizationLevel)
    private levelRepo: Repository<OrganizationLevel>,
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(Position)
    private positionRepo: Repository<Position>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(OrganizationPositionAssignment)
    private assignmentRepo: Repository<OrganizationPositionAssignment>,
  ) {}

  async seed() {
    console.log('🌱 Starting Hierarchical Organization Seed...');

    // 1. Create Organization Levels
    const levels = await this.seedLevels();
    console.log('✅ Organization Levels seeded');

    // 2. Create Positions for each level
    await this.seedPositions(levels);
    console.log('✅ Positions seeded');

    // 3. Create Default Permissions
    const permissions = await this.seedPermissions();
    console.log('✅ Permissions seeded');

    // 4. Create Sample Organization Tree
    await this.seedSampleTree(levels);
    console.log('✅ Sample Organization Tree seeded');

    console.log('🏁 Hierarchical Seed Completed!');
  }

  private async seedLevels() {
    const levelData = [
      { name: 'CENTRAL', bnName: 'কেন্দ্রীয়', slug: 'central', hierarchy_order: 1 },
      { name: 'CITY / METROPOLITAN', bnName: 'মহানগর', slug: 'city', hierarchy_order: 2 },
      { name: 'THANA', bnName: 'থানা', slug: 'thana', hierarchy_order: 3 },
      { name: 'WARD', bnName: 'ওয়ার্ড', slug: 'ward', hierarchy_order: 4 },
      { name: 'UNIT', bnName: 'ইউনিট', slug: 'unit', hierarchy_order: 5 },
    ];

    const levels: Record<string, OrganizationLevel> = {};
    for (const data of levelData) {
      let level = await this.levelRepo.findOne({ where: { slug: data.slug } });
      if (!level) {
        level = this.levelRepo.create({
          name: data.name,
          bnName: data.bnName,
          slug: data.slug,
          hierarchyOrder: data.hierarchy_order,
        });
        level = await this.levelRepo.save(level);
      }
      levels[data.slug] = level;
    }
    return levels;
  }

  private async seedPositions(levels: Record<string, OrganizationLevel>) {
    const positionData = {
      central: [
        { en: 'Ameer', bn: 'আমীর' },
        { en: 'Nayeb-e-Ameer', bn: 'নায়েবে আমীর' },
        { en: 'Secretary General', bn: 'সেক্রেটারি জেনারেল' },
        { en: 'Assistant Secretary General', bn: 'সহকারী সেক্রেটারি জেনারেল' },
        { en: 'Central Executive Member', bn: 'কেন্দ্রীয় নির্বাহী সদস্য' },
        { en: 'Central Shura Member', bn: 'কেন্দ্রীয় মজলিসে শূরা সদস্য' },
        { en: 'Central Working Committee Member', bn: 'কেন্দ্রীয় কর্মপরিষদ সদস্য' },
        { en: 'Finance Secretary', bn: 'অর্থ সম্পাদক' },
        { en: 'Dawah Secretary', bn: 'দাওয়াহ সম্পাদক' },
        { en: 'Training Secretary', bn: 'প্রশিক্ষণ সম্পাদক' },
        { en: 'Media Secretary', bn: 'প্রচার সম্পাদক' }
      ],
      city: [
        { en: 'City Ameer', bn: 'মহানগর আমীর' },
        { en: 'City Nayeb-e-Ameer', bn: 'মহানগর নায়েবে আমীর' },
        { en: 'City Secretary', bn: 'মহানগর সেক্রেটারি' },
        { en: 'City Executive Member', bn: 'মহানগর নির্বাহী সদস্য' },
        { en: 'City Shura Member', bn: 'মহানগর মজলিসে শূরা সদস্য' },
        { en: 'City Finance Secretary', bn: 'মহানগর অর্থ সম্পাদক' },
        { en: 'City Dawah Secretary', bn: 'মহানগর দাওয়াহ সম্পাদক' }
      ],
      thana: [
        { en: 'Thana Ameer', bn: 'থানা আমীর' },
        { en: 'Thana Secretary', bn: 'থানা সেক্রেটারি' },
        { en: 'Thana Executive Member', bn: 'থানা নির্বাহী সদস্য' },
        { en: 'Thana Shura Member', bn: 'থানা মজলিসে শূরা সদস্য' },
        { en: 'Thana Finance Secretary', bn: 'থানা অর্থ সম্পাদক' },
        { en: 'Thana Dawah Secretary', bn: 'থানা দাওয়াহ সম্পাদক' }
      ],
      ward: [
        { en: 'Ward Ameer / President', bn: 'ওয়ার্ড আমীর / সভাপতি' },
        { en: 'Ward Vice President', bn: 'ওয়ার্ড সহ-সভাপতি' },
        { en: 'Ward Secretary', bn: 'ওয়ার্ড সেক্রেটারি' },
        { en: 'Ward Executive Member', bn: 'ওয়ার্ড নির্বাহী সদস্য' },
        { en: 'Ward Finance Coordinator', bn: 'ওয়ার্ড অর্থ সমন্বয়কারী' },
        { en: 'Ward Dawah Coordinator', bn: 'ওয়ার্ড দাওয়াহ সমন্বয়কারী' },
        { en: 'Ward Training Coordinator', bn: 'ওয়ার্ড প্রশিক্ষণ সমন্বয়কারী' }
      ],
      unit: [
        { en: 'Unit Ameer / President', bn: 'ইউনিট আমীর / সভাপতি' },
        { en: 'Unit Secretary', bn: 'ইউনিট সেক্রেটারি' },
        { en: 'Unit Member', bn: 'ইউনিট সদস্য' },
        { en: 'Unit Worker', bn: 'ইউনিট কর্মী' },
        { en: 'Unit Finance Coordinator', bn: 'ইউনিট অর্থ সমন্বয়কারী' },
        { en: 'Unit Dawah Coordinator', bn: 'ইউনিট দাওয়াহ সমন্বয়কারী' }
      ]
    };

    for (const [slug, names] of Object.entries(positionData)) {
      const level = levels[slug];
      for (let i = 0; i < names.length; i++) {
        const { en: name, bn: bnName } = names[i];
        const posSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let position = await this.positionRepo.findOne({ 
          where: { slug: posSlug, organizationLevelId: level.id } 
        });
        if (!position) {
          position = this.positionRepo.create({
            name,
            bnName,
            slug: posSlug,
            organizationLevelId: level.id,
            rankOrder: i + 1,
            isExecutive: name.includes('Ameer') || name.includes('Secretary') || name.includes('President'),
          });
          await this.positionRepo.save(position);
        }
      }
    }
  }

  private async seedPermissions() {
    const perms = [
      { name: 'Manage Organizations', bn: 'সংস্থা পরিচালনা', slug: 'manage-orgs' },
      { name: 'View Organizations', bn: 'সংস্থা দেখুন', slug: 'view-orgs' },
      { name: 'Assign Positions', bn: 'পদ বরাদ্দ করুন', slug: 'assign-positions' },
      { name: 'Transfer Positions', bn: 'পদ পরিবর্তন করুন', slug: 'transfer-positions' },
      { name: 'Revoke Positions', bn: 'পদ বাতিল করুন', slug: 'revoke-positions' },
      { name: 'Manage Users', bn: 'ব্যবহারকারী পরিচালনা', slug: 'manage-users' },
      { name: 'View Reports', bn: 'রিপোর্ট দেখুন', slug: 'view-reports' },
    ];

    const seededPerms: Permission[] = [];
    for (const data of perms) {
      let perm = await this.permissionRepo.findOne({ where: { slug: data.slug } });
      if (!perm) {
        perm = this.permissionRepo.create({
          name: data.name,
          bnName: data.bn,
          slug: data.slug,
        });
        perm = await this.permissionRepo.save(perm);
      }
      seededPerms.push(perm);
    }
    return seededPerms;
  }

  private async seedSampleTree(levels: Record<string, OrganizationLevel>) {
    // Helper to create password hash
    const hashedPassword = await bcrypt.hash('admin@bjioms.com', 10);
    const centralAmeerPassword = await bcrypt.hash('central@bjioms.com', 10);

    // 1. Central Admin (Root)
    let central = await this.orgRepo.findOne({ where: { slug: 'central-admin' } });
    if (!central) {
      central = this.orgRepo.create({
        name: 'Central Admin',
        bnName: 'কেন্দ্রীয় প্রশাসন',
        slug: 'central-admin',
        organizationLevelId: levels.central.id,
        code: 'CENTRAL-001',
      });
      central = await this.orgRepo.save(central);
    }

    // Create Super Admin User
    let admin = await this.userRepo.findOne({ where: { email: 'admin@bjioms.com' } });
    if (!admin) {
      admin = this.userRepo.create({
        name: 'Super Admin',
        bnName: 'সুপার অ্যাডমিন',
        email: 'admin@bjioms.com',
        password: hashedPassword,
        isActive: true,
        canCreateUsers: true,
        organizationId: central.id,
      });
    } else {
      admin.password = hashedPassword;
      admin.canCreateUsers = true;
      admin.organizationId = central.id;
    }
    admin = await this.userRepo.save(admin);

    // Create Dedicated Central Ameer
    let centralAmeer = await this.userRepo.findOne({ where: { email: 'central@bjioms.com' } });
    if (!centralAmeer) {
      centralAmeer = this.userRepo.create({
        name: 'Central Ameer',
        bnName: 'কেন্দ্রীয় আমীর',
        email: 'central@bjioms.com',
        password: centralAmeerPassword,
        isActive: true,
        canCreateUsers: true,
        organizationId: central.id,
      });
      centralAmeer = await this.userRepo.save(centralAmeer);
    }

    // Assign Position to Central Admins
    const centralAmeerPos = await this.positionRepo.findOne({ 
      where: { slug: 'ameer', organizationLevelId: levels.central.id } 
    });
    if (centralAmeerPos) {
      // Assign to Super Admin
      const existingAdmin = await this.assignmentRepo.findOne({
        where: { organizationId: central.id, userId: admin.id, positionId: centralAmeerPos.id }
      });
      if (!existingAdmin) {
        await this.assignmentRepo.save(this.assignmentRepo.create({
          organizationId: central.id,
          userId: admin.id,
          positionId: centralAmeerPos.id,
          status: 'active',
          startDate: new Date(),
        }));
      }

      // Assign to Dedicated Central Ameer
      const existingAmeer = await this.assignmentRepo.findOne({
        where: { organizationId: central.id, userId: centralAmeer.id, positionId: centralAmeerPos.id }
      });
      if (!existingAmeer) {
        await this.assignmentRepo.save(this.assignmentRepo.create({
          organizationId: central.id,
          userId: centralAmeer.id,
          positionId: centralAmeerPos.id,
          status: 'active',
          startDate: new Date(),
        }));
      }
    }

    // 2. City Level Orgs
    const cityOrgs = [
      { name: 'Dhaka City South', bn: 'ঢাকা মহানগর দক্ষিণ', slug: 'dhaka-city-south' },
      { name: 'Dhaka City North', bn: 'ঢাকা মহানগর উত্তর', slug: 'dhaka-city-north' },
      { name: 'Dhaka District', bn: 'ঢাকা জেলা', slug: 'dhaka-district' },
    ];

    for (const data of cityOrgs) {
      let org = await this.orgRepo.findOne({ where: { slug: data.slug } });
      if (!org) {
        org = this.orgRepo.create({
          name: data.name,
          bnName: data.bn,
          slug: data.slug,
          organizationLevelId: levels.city.id,
          parentId: central.id,
          code: `CITY-${data.slug.toUpperCase().substring(0, 3)}-001`,
        });
        await this.orgRepo.save(org);
      }
    }
  }
}
