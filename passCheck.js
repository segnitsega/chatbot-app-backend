const bcrypt = require("bcryptjs");

(async () => {
  const password = "testPassword123"; // The password you used during signup
  const hashFromDB = "$2a$10$vw8EZguR2rzE.egtW8XyF..v5iWNGoEM1RrdosiMZEbg/rpK/vN36"; // Replace with your actual hash

  const isMatch = await bcrypt.compare(password, hashFromDB);
  console.log("Password match:", isMatch); // Should print "true" if the password matches
})();
