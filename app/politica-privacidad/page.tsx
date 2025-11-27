export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Información General
              </h2>
              <p className="text-gray-700 mb-4">
                En cumplimiento de lo establecido en el Reglamento (UE) 2016/679 del Parlamento
                Europeo y del Consejo de 27 de abril de 2016 relativo a la protección de las
                personas físicas en lo que respecta al tratamiento de datos personales y a la
                libre circulación de estos datos (RGPD), y la Ley Orgánica 3/2018, de 5 de
                diciembre, de Protección de Datos Personales y garantía de los derechos
                digitales (LOPDGDD), le informamos sobre el tratamiento de sus datos personales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Responsable del Tratamiento
              </h2>
              <p className="text-gray-700 mb-4">
                <strong>Club Deportivo Onda</strong>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email de contacto:</strong>{' '}
                <a
                  href="mailto:escolafut@gmail.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  escolafut@gmail.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Datos que Recopilamos
              </h2>
              <p className="text-gray-700 mb-4">
                Recopilamos los siguientes tipos de datos personales:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Datos de identificación:</strong> Nombre, apellidos, DNI, fecha de
                  nacimiento
                </li>
                <li>
                  <strong>Datos de contacto:</strong> Email, teléfono
                </li>
                <li>
                  <strong>Datos de inscripción:</strong> Información relacionada con las
                  inscripciones a campus y actividades del club
                </li>
                <li>
                  <strong>Datos de salud:</strong> Información médica relevante (alergias,
                  enfermedades, medicación) cuando es necesario para la seguridad del
                  participante
                </li>
                <li>
                  <strong>Datos de navegación:</strong> Información sobre cómo utiliza nuestro
                  sitio web (mediante cookies, ver{' '}
                  <a
                    href="/politica-cookies"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Política de Cookies
                  </a>
                  )
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Finalidad del Tratamiento
              </h2>
              <p className="text-gray-700 mb-4">
                Los datos personales se tratan con las siguientes finalidades:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Gestionar las inscripciones a campus y actividades del club</li>
                <li>Mantener comunicación con los usuarios y sus tutores legales</li>
                <li>Gestionar la seguridad y el bienestar de los participantes</li>
                <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Análisis estadístico y mejora del sitio web</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Base Jurídica
              </h2>
              <p className="text-gray-700 mb-4">
                El tratamiento de sus datos personales se basa en:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Consentimiento del interesado:</strong> Para el tratamiento de datos
                  de inscripciones y comunicaciones
                </li>
                <li>
                  <strong>Ejecución de un contrato:</strong> Para la gestión de inscripciones y
                  actividades
                </li>
                <li>
                  <strong>Interés vital:</strong> Para el tratamiento de datos de salud cuando es
                  necesario para la seguridad del participante
                </li>
                <li>
                  <strong>Obligación legal:</strong> Para el cumplimiento de normativas
                  aplicables
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Conservación de los Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Los datos personales se conservarán durante el tiempo necesario para cumplir con
                las finalidades para las que fueron recabados y, en todo caso, durante los plazos
                establecidos por la legislación aplicable. Una vez finalizado el plazo de
                conservación, los datos serán eliminados de forma segura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Compartir Datos con Terceros
              </h2>
              <p className="text-gray-700 mb-4">
                No compartimos sus datos personales con terceros, excepto:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Cuando sea necesario para la prestación del servicio solicitado</li>
                <li>Cuando exista una obligación legal</li>
                <li>Con proveedores de servicios que actúan como encargados de tratamiento
                  (hosting, servicios de email, etc.)
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Utilizamos servicios de terceros como Google Analytics para el análisis del
                tráfico web. Estos servicios pueden recopilar información de forma anónima. Para
                más información, consulte nuestra{' '}
                <a
                  href="/politica-cookies"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Política de Cookies
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Sus Derechos
              </h2>
              <p className="text-gray-700 mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>Acceso:</strong> Obtener información sobre sus datos personales que
                  tratamos
                </li>
                <li>
                  <strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o
                  incompletos
                </li>
                <li>
                  <strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no
                  sean necesarios
                </li>
                <li>
                  <strong>Oposición:</strong> Oponerse al tratamiento de sus datos en ciertas
                  circunstancias
                </li>
                <li>
                  <strong>Limitación del tratamiento:</strong> Solicitar la limitación del
                  tratamiento en determinadas situaciones
                </li>
                <li>
                  <strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado
                </li>
                <li>
                  <strong>Retirar el consentimiento:</strong> En cualquier momento, cuando el
                  tratamiento se base en consentimiento
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                Para ejercer estos derechos, puede contactarnos en:{' '}
                <a
                  href="mailto:escolafut@gmail.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  escolafut@gmail.com
                </a>
              </p>
              <p className="text-gray-700 mb-4">
                También tiene derecho a presentar una reclamación ante la Agencia Española de
                Protección de Datos (AEPD) si considera que el tratamiento de sus datos no se
                ajusta a la normativa vigente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Seguridad de los Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas y organizativas apropiadas para proteger sus
                datos personales contra el acceso no autorizado, la pérdida, la destrucción o la
                alteración. Sin embargo, ningún sistema de transmisión por Internet es 100%
                seguro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Menores de Edad
              </h2>
              <p className="text-gray-700 mb-4">
                El tratamiento de datos de menores de edad se realiza con el consentimiento de
                sus tutores legales. Los tutores pueden ejercer los derechos de acceso,
                rectificación, supresión, oposición, limitación y portabilidad en nombre del menor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Modificaciones
              </h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar esta Política de Privacidad. Las
                modificaciones serán publicadas en esta página con la fecha de última
                actualización.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contacto</h2>
              <p className="text-gray-700 mb-4">
                Para cualquier consulta sobre esta Política de Privacidad o el tratamiento de
                sus datos personales, puede contactarnos en:
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

