# Monitoreo de variables de Arduino a través de interfaz web
Agustín Neira

Este proyecto pretende inicialmente la interconexión de un Arduino, un servidor y un cliente web, para poder en este último mostrar el estado en tiempo real de las distinta entradas del primero. 	Si bien en principio se pretenderá una conexión bastante rígida, de forma incremental se pretenderá agregar funciones para configurar los parámetros de transferencia de datos, como por ejemplo muestras por segundo, e incluso alternar de forma dinámica qué entradas se están viendo. También se podría implementar un mecanismo para modificar los estados de las salidas de forma dinámica, desde un cliente web.
A medida que el proyecto crezca, este alto nivel de control sobre el arduino desde un cliente web plantea un problema de seguridad: desde interferencias en el control del mismo por parte de varios clientes conectados en simultáneo, a un control malicioso del dispositivo por parte de un tercero. Entonces surgirá la necesidad de implementar un sistema de autenticación, que podrá ser complementado con una base de usuarios con distintos privilegios, administrados desde el servidor.

El diseño inicial del programa se divide en tres:
- *Arduino*: esta primera etapa consiste en la programación del Arduino para establecer una conexión serial y enviar reptidamente reportes de estado de una o más de sus entradas analógicas. Futuras actualizaciones pueden agregarle flexibilidad al sistema, para que el ordenador del otro lado pueda modificar en el Arduino qué entradas se analizan y a qué tasa de muestreo.
- *Servidor*: por diferencias de performance y su fácil implementcaión de servidores y utilización de librerías para el front-end, se utilizará Node.js para esta etapa. La comunicación serial se hará mediante la librería 'serialport'; el servidor se hará con Express.js y la transmisión de datos en tiempo real con Socket.IO.
- *Frontend*: esta última etapa deberá recibir periódicamente la información del servidor, por medio de la librería Socket.IO; y graficarla en tiempo real, mediante el uso de D3.js. Por último, si la interfaz se complejiza mucho se implementará un framework de frontend, probablemente React.js.

## Instalación y ejecución

Este proyecto se está desarrollando con Node.js versión 12.18.3, que se distribuye de forma gratuita en [la página oficial](https://nodejs.org). Una vez instalado, el proceso de instalación del software es:
```
git clone https://github.com/AgusNeira/arduino-web-monitoring.git
cd arduino-git-monitoring
npm install
```

En el nivel actual de desarrollo no hay un arranque en modo de producción. El modo de desarrollo se ejecuta de la siguiente forma:
```
npm run dev
```
