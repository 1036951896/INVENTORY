import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class FilesController {
  @Get('images/productos/:filename')
  serveImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // Validar que el filename no contenga caracteres peligrosos
    if (!filename.match(/^[\w\-\.]+\.(jpg|jpeg|png|webp|gif)$/i)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Ruta correcta construida desde process.cwd() + backend/public
    const filePath = join(
      process.cwd(),
      'backend',
      'public',
      'images',
      'productos',
      filename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException('Imagen no encontrada: ' + filePath);
    }

    // Enviar con headers CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Cache-Control', 'public, max-age=86400');
    res.sendFile(filePath);
  }
}
