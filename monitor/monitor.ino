int incremental = 0;
int pins[4] = {A0, A1, A2, A3};
int values[4] = {0, 0, 0, 0};

/*  
 *  largo del mensaje: "NNN:XXXX;NNN:XXXX;NNN:XXXX;NNN:XXXX"
 *                      3 * 4 caracteres para número de PIN (A0 - A15)
 *                      4 * 4 caracteres para valor de PIN (0 - 1023)
 *                      7 delimitadores
 *                      1 retorno de línea '\n'
 *                      36 caracteres
 */
char message[36];

void setup() {
	// put your setup code here, to run once:
	Serial.begin(9600);

	while (!Serial) {
		delay(10);
		Serial.begin(9600);
	}
  randomSeed(15);
}

void loop() {
	float angle = incremental++ * 2 * 3.14 / 1024;
  if (incremental == 1024) incremental = 0;

  values[0] = incremental;
  values[1] = (int) (sin(angle) * 512 + 512);
  values[2] = (int) (cos(angle) * 512 + 512);
  values[3] = random(0, 1024);

  snprintf(message, 36, "%d:%d;%d:%d;%d:%d;%d:%d",
          pins[0], values[0], pins[1], values[1],
          pins[2], values[2], pins[3], values[3]);
  Serial.println(message);

  delay(500);
}
