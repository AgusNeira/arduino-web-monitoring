int incremental = 0;
int pins[4] = {A0, A1, A2, A3};
int values[4] = {0, 0, 0, 0};

/*  
 *  largo del mensaje: "XXXX;XXXX;XXXX;XXXX"
 *                      4 * 4 caracteres para valor de PIN (0 - 1023)
 *                      7 delimitadores
 *                      1 retorno de línea '\n'
 *                      24 caracteres
 */
char message[24];

void setup() {
	Serial.begin(9600);

	while (!Serial) {
		delay(10);
		Serial.begin(9600);
	}
    randomSeed(15);
}

void loop() {
	float angle = incremental++ * 2 * 3.14 / 128;
  if (incremental == 1024) incremental = 0;

  values[0] = incremental;
  values[1] = (int) (sin(angle) * 512 + 512);
  values[2] = (int) (cos(angle) * 512 + 512);
  values[3] = random(0, 1024);

  snprintf(message, 36, "%d;%d;%d;%d",
          values[0], values[1], values[2], values[3]);
  Serial.println(message);

  delay(250);
}
