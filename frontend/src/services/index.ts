/**
 * Archivo centralizado de exportación de servicios
 * Importar servicios desde aquí para mejor mantenimiento
 */

export { default as authService } from './auth.service';
export { default as productsService } from './products.service';
export { default as ordersService } from './orders.service';
export { default as usersService } from './users.service';
export { default as categoriesService } from './categories.service';

export { api, createApiClient } from './api.client';

export type * from './auth.service';
export type * from './products.service';
export type * from './orders.service';
export type * from './users.service';
export type * from './categories.service';
