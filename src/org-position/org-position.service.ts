import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrgPosition } from '../common/entities';
import { CreateOrgPositionDto, UpdateOrgPositionDto } from './org-position.dto';

@Injectable()
export class OrgPositionService {
  constructor(
    @InjectRepository(OrgPosition)
    private positionRepo: Repository<OrgPosition>,
  ) {}

  async findByOrganization(organizationId: number): Promise<any[]> {
    const rows = await this.positionRepo.query(
      `SELECT p.id, p.user_id, p.organization_id, p.position_title, p.position_group,
              p.notes, p.is_active, p.start_date, p.end_date, p.created_at, p.updated_at,
              u.id AS u_id, u.name AS u_name, u.email AS u_email,
              u.phone AS u_phone, u."isActive" AS u_is_active
       FROM organization_position_assignments p
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.organization_id = $1
       ORDER BY p.position_group ASC, p.position_title ASC`,
      [organizationId],
    );
    return rows.map((r: any) => ({
      id: r.id,
      organizationId: r.organization_id,
      userId: r.user_id,
      positionTitle: r.position_title,
      positionGroup: r.position_group,
      notes: r.notes,
      isActive: r.is_active,
      startDate: r.start_date,
      endDate: r.end_date,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      user: r.u_id
        ? { id: r.u_id, name: r.u_name, email: r.u_email, phone: r.u_phone, isActive: r.u_is_active }
        : null,
    }));
  }

  async create(dto: CreateOrgPositionDto): Promise<any> {
    // Prevent duplicate slot if same title/group already exists for this org (optional, but good for some groups)
    // However, for TEAM or SHURA, multiple slots are allowed.
    // So we primarily check for duplicate USER assignments.
    if (dto.userId) {
      const existing = await this.positionRepo.findOne({
        where: { 
          organizationId: dto.organizationId, 
          userId: dto.userId, 
          positionTitle: dto.positionTitle 
        }
      });
      if (existing) {
        throw new Error('This user is already assigned to this position in this organization.');
      }
    }

    const position = this.positionRepo.create({
      organizationId: dto.organizationId,
      userId: dto.userId ?? null,
      positionTitle: dto.positionTitle,
      positionGroup: dto.positionGroup,
      notes: dto.notes ?? null,
      isActive: true,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    } as any);
    return this.positionRepo.save(position as any);
  }

  async update(id: number, dto: UpdateOrgPositionDto): Promise<any> {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException(`Position ${id} not found`);

    if (dto.userId) {
      const existing = await this.positionRepo.findOne({
        where: { 
          organizationId: position.organizationId, 
          userId: dto.userId, 
          positionTitle: position.positionTitle 
        }
      });
      if (existing && existing.id !== id) {
        throw new Error('This user is already assigned to this position in this organization.');
      }
    }

    if (dto.userId !== undefined) position.userId = dto.userId as any;
    if (dto.positionTitle !== undefined) position.positionTitle = dto.positionTitle;
    if (dto.positionGroup !== undefined) position.positionGroup = dto.positionGroup;
    if (dto.isActive !== undefined) position.isActive = dto.isActive;
    if (dto.notes !== undefined) position.notes = dto.notes;
    if (dto.startDate !== undefined) position.startDate = dto.startDate ? new Date(dto.startDate) : null as any;
    if (dto.endDate !== undefined) position.endDate = dto.endDate ? new Date(dto.endDate) : null as any;

    return this.positionRepo.save(position);
  }

  async remove(id: number): Promise<void> {
    const position = await this.positionRepo.findOne({ where: { id } });
    if (!position) throw new NotFoundException(`Position ${id} not found`);
    await this.positionRepo.remove(position);
  }

  async seedDefaultPositions(organizationId: number, orgType: string): Promise<any[]> {
    const templates = DEFAULT_POSITIONS[orgType] ?? [];
    const created: OrgPosition[] = [];
    
    // Get existing positions to avoid duplicates
    const existingPositions = await this.positionRepo.find({
      where: { organizationId } as any
    });

    for (const tmpl of templates) {
      // For groups like SHURA or TEAM, multiple slots are allowed.
      // We check if we already have the required number of slots for this title.
      const templateCount = templates.filter(t => t.title === tmpl.title).length;
      const currentCount = existingPositions.filter(p => p.positionTitle === tmpl.title).length;

      if (currentCount < templateCount) {
        const pos = this.positionRepo.create({
          organizationId,
          userId: null,
          positionTitle: tmpl.title,
          positionGroup: tmpl.group,
          isActive: true,
        } as any);
        const saved = await this.positionRepo.save(pos as any);
        created.push(saved);
        
        // Update local tracking to handle multiple slots for same title in one loop
        existingPositions.push(saved);
      }
    }
    return created;
  }
}

const DEFAULT_POSITIONS: Record<string, { title: string; group: string }[]> = {
  UNIT: [
    { title: 'President', group: 'EXECUTIVE' },
    { title: 'Secretary', group: 'EXECUTIVE' },
    { title: 'Baitulmal', group: 'EXECUTIVE' },
    { title: 'Office', group: 'EXECUTIVE' },
    { title: 'Librarian', group: 'EXECUTIVE' },
    { title: 'Sports', group: 'EXECUTIVE' },
  ],
  WARD: [
    { title: 'President', group: 'EXECUTIVE' },
    { title: 'Secretary', group: 'EXECUTIVE' },
    { title: 'Baitulmal', group: 'EXECUTIVE' },
    { title: 'Librarian', group: 'EXECUTIVE' },
    { title: 'Sports', group: 'EXECUTIVE' },
    { title: 'Team Member', group: 'TEAM' },
    { title: 'Team Member', group: 'TEAM' },
    { title: 'Team Member', group: 'TEAM' },
    { title: 'Team Member', group: 'TEAM' },
  ],
  THANA: [
    { title: 'President', group: 'EXECUTIVE' },
    { title: 'Secretary', group: 'EXECUTIVE' },
    { title: 'Secretariat Member', group: 'EXECUTIVE' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Shura Member', group: 'SHURA' },
  ],
  CITY: [
    { title: 'President', group: 'EXECUTIVE' },
    { title: 'Secretary', group: 'EXECUTIVE' },
    { title: 'Secretariat Member', group: 'EXECUTIVE' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Shura Member', group: 'SHURA' },
  ],
  CENTRAL: [
    { title: 'President', group: 'EXECUTIVE' },
    { title: 'Secretary', group: 'EXECUTIVE' },
    { title: 'Secretariat Member', group: 'EXECUTIVE' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Kormo Porishodh Member', group: 'KORMO_PORISHODH' },
    { title: 'Shura Member', group: 'SHURA' },
  ],
};
