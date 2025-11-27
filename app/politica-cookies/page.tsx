export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Política de Cookies
          </h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Qué son las cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
                cuando visitas un sitio web. Estas cookies permiten que el sitio web recuerde
                tus acciones y preferencias durante un período de tiempo, por lo que no tienes
                que volver a configurarlas cada vez que regresas al sitio o navegas de una página
                a otra.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Cómo utilizamos las cookies?
              </h2>
              <p className="text-gray-700 mb-4">
                En cdonda.es utilizamos cookies para:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Analizar cómo los visitantes interactúan con nuestro sitio web</li>
                <li>Mejorar la funcionalidad y la experiencia del usuario</li>
                <li>Recopilar información estadística sobre el uso del sitio</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tipos de cookies que utilizamos
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cookies de Análisis (Opcionales)
                </h3>
                <p className="text-gray-700 mb-2">
                  Utilizamos Google Analytics y Google Tag Manager para recopilar información
                  sobre cómo los visitantes utilizan nuestro sitio web. Esta información nos
                  ayuda a mejorar el sitio y a entender mejor las necesidades de nuestros
                  usuarios.
                </p>
                <p className="text-gray-700 mb-2">
                  Estas cookies recopilan información de forma anónima, incluyendo:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
                  <li>Número de visitantes</li>
                  <li>Páginas visitadas</li>
                  <li>Tiempo de permanencia en el sitio</li>
                  <li>Origen del tráfico</li>
                </ul>
                <p className="text-sm text-gray-600 italic">
                  Puedes rechazar estas cookies en cualquier momento desde el banner de
                  consentimiento.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Gestión de cookies
              </h2>
              <p className="text-gray-700 mb-4">
                Puedes gestionar tus preferencias de cookies en cualquier momento:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Aceptar todas:</strong> Permite el uso de todas las cookies
                </li>
                <li>
                  <strong>Rechazar todas:</strong> Bloquea todas las cookies opcionales
                </li>
                <li>
                  <strong>Configurar:</strong> Elige qué tipos de cookies deseas permitir
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                También puedes configurar tu navegador para que rechace las cookies, aunque
                esto puede afectar la funcionalidad de algunas partes del sitio web.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Cookies de terceros
              </h2>
              <p className="text-gray-700 mb-4">
                Algunas cookies son establecidas por servicios de terceros que aparecen en
                nuestras páginas. No tenemos control sobre estas cookies. Para obtener más
                información sobre cómo estos terceros utilizan las cookies, consulta sus
                políticas de privacidad:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Política de Privacidad de Google
                  </a>
                </li>
                <li>
                  <a
                    href="https://policies.google.com/technologies/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Cómo utiliza Google las cookies
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Actualizaciones de esta política
              </h2>
              <p className="text-gray-700 mb-4">
                Podemos actualizar esta Política de Cookies de vez en cuando para reflejar
                cambios en las cookies que utilizamos o por otras razones operativas, legales
                o regulatorias. Te recomendamos que revises esta página periódicamente para
                estar informado sobre nuestro uso de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacto</h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre nuestra Política de Cookies, puedes contactarnos en:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:escolafut@gmail.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  escolafut@gmail.com
                </a>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

