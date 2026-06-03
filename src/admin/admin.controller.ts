import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('admin/users')
@Roles(Role.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  findAll() {
    return this.adminService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.getUserById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateUserById(+id, updateAdminDto);
  }
}
