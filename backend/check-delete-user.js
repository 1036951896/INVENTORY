const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const email = 'santis3268@gmail.com';
    
    // Buscar el usuario
    const usuario = await prisma.user.findUnique({
      where: { email }
    });

    if (!usuario) {
      console.log(`\n✅ El usuario ${email} NO está registrado\n`);
      await prisma.$disconnect();
      return;
    }

    console.log(`\n⚠️ El usuario ${email} SÍ está registrado`);
    console.log(`   ID: ${usuario.id}`);
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Rol: ${usuario.rol}\n`);

    // Preguntar si deseas eliminarlo
    console.log('Eliminando usuario...\n');

    // Eliminar direcciones asociadas primero
    await prisma.address.deleteMany({
      where: { usuarioId: usuario.id }
    });

    // Eliminar usuario
    const deleted = await prisma.user.delete({
      where: { email }
    });

    console.log(`✅ Usuario ${deleted.nombre} (${deleted.email}) eliminado correctamente\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
