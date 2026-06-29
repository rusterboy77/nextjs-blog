import { test, expect } from "@playwright/test";

test("El operador puede iniciar sesión y acceder al Dashboard", async ({
  page,
}) => {
  // 1. Navegar a la página principal
  await page.goto("http://localhost:3000");

  // 2. Rellenar las credenciales (¡Cambia estos datos por los de tu usuario real!)
  await page.fill("#user_id", "Rusterboy77"); // Pon aquí el usuario que creaste
  await page.fill("#encryption_key", "17071981MCRmcr"); // Pon aquí la contraseña correcta

  // 3. Hacer clic en el botón de Autenticar
  await page.click('button:has-text("Autenticar")');

  // 4. Verificar que aparece el mensaje temporal de éxito
  const mensajeExito = page.locator("text=Estableciendo enlace con el núcleo");
  await expect(mensajeExito).toBeVisible();

  // 5. El momento crítico: Playwright debe esperar a que la web nos redirija al Dashboard
  // Le damos un tiempo máximo de espera generoso porque tenemos un setTimeout de 1.5s
  await page.waitForURL("http://localhost:3000/dashboard", { timeout: 5000 });

  // 6. Verificar que la nueva página es el Dashboard comprobando el título
  await expect(page).toHaveTitle("Dashboard Principal");

  // 7. Verificar que GraphQL ha cargado nuestros datos y estamos ONLINE
  // Buscamos específicamente la palabra ONLINE en color verde
  const estadoConexion = page.locator("text=ONLINE");
  await expect(estadoConexion).toBeVisible();
});
