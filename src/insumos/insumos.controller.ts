import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { buildPaginationOptions } from '../common/utils/pagination.util';
import { CreateCostoMantenimientoDto } from './dto/create-costo-mantenimiento.dto';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateCostoMantenimientoDto } from './dto/update-costo-mantenimiento.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { InsumosService } from './insumos.service';

@Controller('insumos')
export class InsumosController {
  constructor(private readonly insumosService: InsumosService) {}

  @Get()
  findAllInsumos(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.insumosService.findAllInsumos(buildPaginationOptions(req, query));
  }

  @Get('costos/mantenimiento')
  findCostosMantenimiento(@Req() req: Request, @Query() query: PaginationQueryDto) {
    return this.insumosService.findAllCostosMantenimiento(
      buildPaginationOptions(req, query),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post()
  createInsumo(@Body() dto: CreateInsumoDto) {
    return this.insumosService.createInsumo(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch(':id')
  updateInsumo(@Param('id') id: string, @Body() dto: UpdateInsumoDto) {
    return this.insumosService.updateInsumo(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete(':id')
  removeInsumo(@Param('id') id: string) {
    return this.insumosService.removeInsumo(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Post('costos/mantenimiento')
  createCostoMantenimiento(@Body() dto: CreateCostoMantenimientoDto) {
    return this.insumosService.createCostoMantenimiento(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Patch('costos/mantenimiento/:id')
  updateCostoMantenimiento(
    @Param('id') id: string,
    @Body() dto: UpdateCostoMantenimientoDto,
  ) {
    return this.insumosService.updateCostoMantenimiento(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERADOR)
  @Delete('costos/mantenimiento/:id')
  removeCostoMantenimiento(@Param('id') id: string) {
    return this.insumosService.removeCostoMantenimiento(id);
  }
}
