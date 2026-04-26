import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { Organization, Permission, Role } from '../entities';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepo: Repository<Organization>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async seed() {
    console.log('🌱 Starting database seed...\n');

    try {
      // Get database connection to execute raw queries
      const dataSource = this.userRepo.manager.connection;

      // Clear existing data using TRUNCATE (more reliable than DELETE)
      console.log('🧹 Clearing existing data...');

      const tablesToTruncate = ['users', 'permission', 'role', 'organizations'];
      for (const table of tablesToTruncate) {
        try {
          await dataSource.query(`TRUNCATE TABLE "${table}" CASCADE`);
          console.log(`  ✓ Truncated ${table}`);
        } catch (e) {
          // Table doesn't exist yet, continue
          if (e.code === '42P01') {
            console.log(`  - Skipping ${table} (doesn't exist yet)`);
          } else {
            console.log(`  ⚠ Could not truncate ${table}:`, e.message);
          }
        }
      }

      const permissions = await this.createPermissions();
      console.log('✓ Permissions created\n');

      // Create organizational hierarchy
      console.log('🏛️  Creating organizational hierarchy...\n');
      await this.createOrganizationHierarchy(permissions);

      console.log('\n✅ Database seed completed successfully!');
      console.log('\n📝 Demo User Credentials:');
      console.log('═══════════════════════════════════════');
      console.log('Central Admin:');
      console.log('  Email: central@bjioms.com');
      console.log('  Password: Central@123');
      console.log('\nCity Manager:');
      console.log('  Email: city@bjioms.com');
      console.log('  Password: City@123');
      console.log('\nThana Officer:');
      console.log('  Email: thana@bjioms.com');
      console.log('  Password: Thana@123');
      console.log('\nWard Coordinator:');
      console.log('  Email: ward@bjioms.com');
      console.log('  Password: Ward@123');
      console.log('\nUnit Member:');
      console.log('  Email: unit@bjioms.com');
      console.log('  Password: Unit@123');
      console.log('═══════════════════════════════════════');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  private async createPermissions(): Promise<Permission[]> {
    const permissionsData = [
      {
        name: 'Create Users',
        resource: 'users',
        action: 'create',
        description: 'Create new users',
      },
      {
        name: 'Read Users',
        resource: 'users',
        action: 'read',
        description: 'Read user information',
      },
      {
        name: 'Update Users',
        resource: 'users',
        action: 'update',
        description: 'Update user information',
      },
      { name: 'Delete Users', resource: 'users', action: 'delete', description: 'Delete users' },

      {
        name: 'Create Activities',
        resource: 'activities',
        action: 'create',
        description: 'Create activities',
      },
      {
        name: 'Read Activities',
        resource: 'activities',
        action: 'read',
        description: 'Read activities',
      },
      {
        name: 'Update Activities',
        resource: 'activities',
        action: 'update',
        description: 'Update activities',
      },
      {
        name: 'Delete Activities',
        resource: 'activities',
        action: 'delete',
        description: 'Delete activities',
      },

      {
        name: 'Create Reports',
        resource: 'reports',
        action: 'create',
        description: 'Create reports',
      },
      { name: 'Read Reports', resource: 'reports', action: 'read', description: 'Read reports' },
      {
        name: 'Update Reports',
        resource: 'reports',
        action: 'update',
        description: 'Update reports',
      },
      {
        name: 'Delete Reports',
        resource: 'reports',
        action: 'delete',
        description: 'Delete reports',
      },

      {
        name: 'Read Organization',
        resource: 'organization',
        action: 'read',
        description: 'Read organization data',
      },
      {
        name: 'Update Organization',
        resource: 'organization',
        action: 'update',
        description: 'Update organization data',
      },
    ];

    const permissions: Permission[] = [];
    for (const perm of permissionsData) {
      const permission = this.permissionRepo.create({
        name: perm.name,
        resource: perm.resource,
        action: perm.action,
        description: perm.description,
      });
      const saved = await this.permissionRepo.save(permission);
      permissions.push(saved);
    }
    return permissions;
  }

  private async createOrganizationHierarchy(permissions: Permission[]) {
    // Helper to generate a random integer in a range
    function randInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper to create users for a unit
    const createUnitUsers = async (unitOrg, unitMemberRole, wardUser) => {
      const numPeople = randInt(5, 10);
      // 1 member
      const memberUsername = `${unitOrg.name.toLowerCase().replace(/\s+/g, '_')}_member`;
      const member = this.userRepo.create({
        email: `${memberUsername}@bjioms.com`,
        password: await this.hashPassword(`${memberUsername}@bjioms.com`),
        name: `${unitOrg.name} Member`,
        organization: unitOrg,
        role: unitMemberRole,
        canCreateUsers: false,
        createdBy: wardUser,
      });
      await this.userRepo.save(member);
      // Activists
      for (let i = 1; i < numPeople; i++) {
        const activistUsername = `${unitOrg.name.toLowerCase().replace(/\s+/g, '_')}_activist${i}`;
        const activist = this.userRepo.create({
          email: `${activistUsername}@bjioms.com`,
          password: await this.hashPassword(`${activistUsername}@bjioms.com`),
          name: `${unitOrg.name} Activist ${i}`,
          organization: unitOrg,
          role: unitMemberRole,
          canCreateUsers: false,
          createdBy: wardUser,
        });
        await this.userRepo.save(activist);
      }
      // Associates (more than 10)
      const numAssociates = randInt(11, 18);
      for (let i = 1; i <= numAssociates; i++) {
        const associateUsername = `${unitOrg.name.toLowerCase().replace(/\s+/g, '_')}_associate${i}`;
        const associate = this.userRepo.create({
          email: `${associateUsername}@bjioms.com`,
          password: await this.hashPassword(`${associateUsername}@bjioms.com`),
          name: `${unitOrg.name} Associate ${i}`,
          organization: unitOrg,
          role: unitMemberRole,
          canCreateUsers: false,
          createdBy: wardUser,
        });
        await this.userRepo.save(associate);
      }
    };

    // Helper to create users for a ward
    const createWardUsers = async (wardOrg, wardCoordinatorRole, thanaUser, unitUsers) => {
      // 3-6 direct ward members
      const numWardMembers = randInt(3, 6);
      for (let i = 1; i <= numWardMembers; i++) {
        const username = `${wardOrg.name.toLowerCase().replace(/\s+/g, '_')}_member${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${wardOrg.name} Member ${i}`,
          organization: wardOrg,
          role: wardCoordinatorRole,
          canCreateUsers: false,
          createdBy: thanaUser,
        });
        await this.userRepo.save(user);
      }
      // 5-8 team (unit presidents/ward secretaries)
      const numTeam = randInt(5, 8);
      for (let i = 1; i <= numTeam; i++) {
        const username = `${wardOrg.name.toLowerCase().replace(/\s+/g, '_')}_team${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${wardOrg.name} Team ${i}`,
          organization: wardOrg,
          role: wardCoordinatorRole,
          canCreateUsers: false,
          createdBy: thanaUser,
        });
        await this.userRepo.save(user);
      }
      // Add users from units (unitUsers)
      // (Assume unitUsers is an array of user objects, if needed for future logic)
    };

    // Helper to create users for a thana
    const createThanaUsers = async (thanaOrg, thanaOfficerRole, cityUser, wardUsers) => {
      // 5-12 secretaries
      const numSecretaries = randInt(5, 12);
      for (let i = 1; i <= numSecretaries; i++) {
        const username = `${thanaOrg.name.toLowerCase().replace(/\s+/g, '_')}_secretary${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${thanaOrg.name} Secretary ${i}`,
          organization: thanaOrg,
          role: thanaOfficerRole,
          canCreateUsers: false,
          createdBy: cityUser,
        });
        await this.userRepo.save(user);
      }
      // 5-8 team (ward presidents/thana secretaries)
      const numTeam = randInt(5, 8);
      for (let i = 1; i <= numTeam; i++) {
        const username = `${thanaOrg.name.toLowerCase().replace(/\s+/g, '_')}_team${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${thanaOrg.name} Team ${i}`,
          organization: thanaOrg,
          role: thanaOfficerRole,
          canCreateUsers: false,
          createdBy: cityUser,
        });
        await this.userRepo.save(user);
      }
      // Add users from wards (wardUsers)
    };

    // Helper to create users for a city
    const createCityUsers = async (cityOrg, cityOfficerRole, divisionUser, thanaUsers) => {
      // 8-15 secretaries
      const numSecretaries = randInt(8, 15);
      for (let i = 1; i <= numSecretaries; i++) {
        const username = `${cityOrg.name.toLowerCase().replace(/\s+/g, '_')}_secretary${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${cityOrg.name} Secretary ${i}`,
          organization: cityOrg,
          role: cityOfficerRole,
          canCreateUsers: false,
          createdBy: divisionUser,
        });
        await this.userRepo.save(user);
      }
      // 5-10 general members for direct thana org
      const numGeneral = randInt(5, 10);
      for (let i = 1; i <= numGeneral; i++) {
        const username = `${cityOrg.name.toLowerCase().replace(/\s+/g, '_')}_general${i}`;
        const user = this.userRepo.create({
          email: `${username}@bjioms.com`,
          password: await this.hashPassword(`${username}@bjioms.com`),
          name: `${cityOrg.name} General Member ${i}`,
          organization: cityOrg,
          role: cityOfficerRole,
          canCreateUsers: false,
          createdBy: divisionUser,
        });
        await this.userRepo.save(user);
      }
      // Add users from thanas (thanaUsers)
    };
    const bangladeshiStructure = {
      divisions: [
        {
          name: 'Dhaka',
          cities: [
            {
              name: 'Dhaka',
              thanas: [
                {
                  name: 'Gulshan',
                  wards: [
                    { wardNumber: 1, unitName: 'Gulshan Unity Hub' },
                    { wardNumber: 2, unitName: 'Gulshan District Center' },
                    { wardNumber: 3, unitName: 'Gulshan Community Unit' },
                  ],
                },
                {
                  name: 'Banani',
                  wards: [
                    { wardNumber: 1, unitName: 'Banani Primary Unit' },
                    { wardNumber: 2, unitName: 'Banani Secondary Unit' },
                  ],
                },
                {
                  name: 'Dhanmondi',
                  wards: [
                    { wardNumber: 1, unitName: 'Dhanmondi Education Hub' },
                    { wardNumber: 2, unitName: 'Dhanmondi Social Unit' },
                  ],
                },
              ],
            },
            {
              name: 'Narayanganj',
              thanas: [
                {
                  name: 'Narayanganj Sadar',
                  wards: [
                    { wardNumber: 1, unitName: 'Narayanganj Central Unit' },
                    { wardNumber: 2, unitName: 'Narayanganj East Unit' },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'Chittagong',
          cities: [
            {
              name: 'Chittagong',
              thanas: [
                {
                  name: 'Chawkbazar',
                  wards: [
                    { wardNumber: 1, unitName: 'Chawkbazar Unit Alpha' },
                    { wardNumber: 2, unitName: 'Chawkbazar Unit Beta' },
                  ],
                },
                {
                  name: 'Halishahar',
                  wards: [{ wardNumber: 1, unitName: 'Halishahar Main Unit' }],
                },
              ],
            },
          ],
        },
        {
          name: 'Khulna',
          cities: [
            {
              name: 'Khulna',
              thanas: [
                {
                  name: 'Khulna Sadar',
                  wards: [{ wardNumber: 1, unitName: 'Khulna Central Unit' }],
                },
              ],
            },
          ],
        },
      ],
    };

    // Create Central Organization
    const centralOrg = this.organizationRepo.create({
      name: 'BJI OMS Central',
      type: 'CENTRAL',
      division: 'National',
    });
    await this.organizationRepo.save(centralOrg);

    // Create Central Admin Role
    const centralAdminRole = this.roleRepo.create({
      name: 'Central Admin',
      description: 'Administrator at central level with full permissions',
      organization: centralOrg,
      permissions: permissions,
    });
    await this.roleRepo.save(centralAdminRole);

    // Create Central User
    const centralUser = this.userRepo.create({
      email: 'central@bjioms.com',
      password: await this.hashPassword('admin@bjioms.com'),
      name: 'Central Administrator',
      mobile: '+880170000001',
      organization: centralOrg,
      role: centralAdminRole,
      canCreateUsers: true,
    });
    await this.userRepo.save(centralUser);

    console.log('✓ Created Central Organization with admin user');

    // Create division, city, thana, ward, and unit hierarchy
    for (const division of bangladeshiStructure.divisions) {
      const divisionOrg = this.organizationRepo.create({
        name: `${division.name} Division`,
        type: 'CITY',
        division: division.name,
        parent: centralOrg,
      });
      await this.organizationRepo.save(divisionOrg);

      // Create Division Manager Role
      const divisionManagerRole = this.roleRepo.create({
        name: `${division.name} Division Manager`,
        description: `Manager for ${division.name} Division`,
        organization: divisionOrg,
        permissions: permissions,
      });
      await this.roleRepo.save(divisionManagerRole);

      // Create Division User with unique email
      const divisionEmail = `division-${division.name.toLowerCase().replace(/\s+/g, '-')}@bjioms.com`;
      const divisionUser = this.userRepo.create({
        email: divisionEmail,
        password: await this.hashPassword('city_admin@bjioms.com'),
        name: `${division.name} Division Manager`,
        organization: divisionOrg,
        role: divisionManagerRole,
        canCreateUsers: true,
        createdBy: centralUser,
      });
      await this.userRepo.save(divisionUser);

      console.log(`✓ Created ${division.name} Division with manager`);

      for (const city of division.cities) {
        const cityOrg = this.organizationRepo.create({
          name: `${city.name} City`,
          type: 'CITY',
          division: division.name,
          city: city.name,
          parent: divisionOrg,
        });
        await this.organizationRepo.save(cityOrg);

        // Create City Officer Role
        const cityOfficerRole = this.roleRepo.create({
          name: `${city.name} City Officer`,
          description: `Officer for ${city.name} city`,
          organization: cityOrg,
          permissions: permissions.filter((p) =>
            ['users', 'activities', 'reports', 'organization'].includes(p.resource),
          ),
        });
        await this.roleRepo.save(cityOfficerRole);

        // Create users for this city and get cityUser
        let cityUser: User | undefined = undefined;
        {
          // 8-15 secretaries (pick the first as cityUser for hierarchy)
          const numSecretaries = 8; // Use minimum for deterministic assignment
          let createdUsers: User[] = [];
          for (let i = 1; i <= numSecretaries; i++) {
            const username = `${cityOrg.name.toLowerCase().replace(/\s+/g, '_')}_secretary${i}`;
            const user = this.userRepo.create({
              email: `${username}@bjioms.com`,
              password: await this.hashPassword(`${username}@bjioms.com`),
              name: `${cityOrg.name} Secretary ${i}`,
              organization: cityOrg,
              role: cityOfficerRole,
              canCreateUsers: false,
              createdBy: divisionUser,
            });
            const savedUser = await this.userRepo.save(user);
            createdUsers.push(savedUser);
          }
          cityUser = createdUsers[0];
        }
        console.log(`  ✓ Created ${city.name} City`);

        for (const thana of city.thanas) {
          const thanaOrg = this.organizationRepo.create({
            name: `${thana.name} Thana`,
            type: 'THANA',
            division: division.name,
            city: city.name,
            thana: thana.name,
            parent: cityOrg,
          });
          await this.organizationRepo.save(thanaOrg);

          // Create Thana Officer Role
          const thanaOfficerRole = this.roleRepo.create({
            name: `${thana.name} Thana Officer`,
            description: `Officer for ${thana.name} thana`,
            organization: thanaOrg,
            permissions: permissions.filter(
              (p) =>
                ['activities', 'reports', 'organization'].includes(p.resource) &&
                p.action !== 'delete',
            ),
          });
          await this.roleRepo.save(thanaOfficerRole);

          // Create users for this thana and get thanaUser
          let thanaUser: User | undefined = undefined;
          {
            // 5-12 secretaries (pick the first as thanaUser)
            const numSecretaries = 5;
            let createdUsers: User[] = [];
            for (let i = 1; i <= numSecretaries; i++) {
              const username = `${thanaOrg.name.toLowerCase().replace(/\s+/g, '_')}_secretary${i}`;
              const user = this.userRepo.create({
                email: `${username}@bjioms.com`,
                password: await this.hashPassword(`${username}@bjioms.com`),
                name: `${thanaOrg.name} Secretary ${i}`,
                organization: thanaOrg,
                role: thanaOfficerRole,
                canCreateUsers: false,
                createdBy: cityUser,
              });
              const savedUser = await this.userRepo.save(user);
              createdUsers.push(savedUser);
            }
            thanaUser = createdUsers[0];
          }
          console.log(`    ✓ Created ${thana.name} Thana`);

          for (const ward of thana.wards) {
            const wardOrg = this.organizationRepo.create({
              name: `${thana.name} Ward ${ward.wardNumber}`,
              type: 'WARD',
              division: division.name,
              city: city.name,
              thana: thana.name,
              wardNumber: ward.wardNumber,
              parent: thanaOrg,
            });
            await this.organizationRepo.save(wardOrg);

            // Create Ward Coordinator Role
            const wardCoordinatorRole = this.roleRepo.create({
              name: `Ward ${ward.wardNumber} Coordinator`,
              description: `Coordinator for Ward ${ward.wardNumber}`,
              organization: wardOrg,
              permissions: permissions.filter(
                (p) =>
                  ['activities', 'reports'].includes(p.resource) &&
                  ['create', 'read', 'update'].includes(p.action),
              ),
            });
            await this.roleRepo.save(wardCoordinatorRole);

            // Create users for this ward and get wardUser
            let wardUser: User | undefined = undefined;
            {
              // 3-6 direct ward members (pick the first as wardUser)
              const numWardMembers = 3;
              let createdUsers: User[] = [];
              for (let i = 1; i <= numWardMembers; i++) {
                const username = `${wardOrg.name.toLowerCase().replace(/\s+/g, '_')}_member${i}`;
                const user = this.userRepo.create({
                  email: `${username}@bjioms.com`,
                  password: await this.hashPassword(`${username}@bjioms.com`),
                  name: `${wardOrg.name} Member ${i}`,
                  organization: wardOrg,
                  role: wardCoordinatorRole,
                  canCreateUsers: false,
                  createdBy: thanaUser,
                });
                const savedUser = await this.userRepo.save(user);
                createdUsers.push(savedUser);
              }
              wardUser = createdUsers[0];
            }
            console.log(`      ✓ Created Ward ${ward.wardNumber}`);

            // Create Unit
            const unitOrg = this.organizationRepo.create({
              name: ward.unitName,
              type: 'UNIT',
              division: division.name,
              city: city.name,
              thana: thana.name,
              wardNumber: ward.wardNumber,
              parent: wardOrg,
            });
            await this.organizationRepo.save(unitOrg);

            // Create Unit Member Role
            const unitMemberRole = this.roleRepo.create({
              name: `Unit Member - ${ward.unitName}`,
              description: `Member in ${ward.unitName}`,
              organization: unitOrg,
              permissions: permissions.filter(
                (p) =>
                  ['activities', 'reports'].includes(p.resource) &&
                  ['read', 'create'].includes(p.action),
              ),
            });
            await this.roleRepo.save(unitMemberRole);

            // Create users for this unit and get unitUser (not needed for hierarchy)
            // ...existing code...
          }
        }
      }
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
