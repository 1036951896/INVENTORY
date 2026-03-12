const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('🥩 Creando categoría Carnes...');

    // Crear la categoría Carnes si no existe
    const carnesCategoria = await prisma.category.upsert({
      where: { id: '7' },
      update: { nombre: 'Carnes', descripcion: 'Carnes y proteínas', icono: '🥩' },
      create: { id: '7', nombre: 'Carnes', descripcion: 'Carnes y proteínas', icono: '🥩' },
    });

    console.log(`✅ Categoría creada/actualizada: ${carnesCategoria.nombre} (id: ${carnesCategoria.id})`);

    // Actualizar el producto de carne de hamburguesa a categoría Carnes
    const updated = await prisma.product.updateMany({
      where: { nombre: { contains: 'CARNE DE HAMBURG' } },
      data: { categoriaId: '7' },
    });

    console.log(`✅ Productos actualizados a "Carnes": ${updated.count}`);

    // Verificar
    const productos = await prisma.product.findMany({
      where: { categoriaId: '7' },
      include: { categoria: true },
    });

    console.log('\n📋 Productos en categoría Carnes:');
    productos.forEach(p => console.log(`  - ${p.nombre} | categoría: ${p.categoria?.nombre}`));

    await prisma.$disconnect();
    console.log('\n✅ Listo!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
