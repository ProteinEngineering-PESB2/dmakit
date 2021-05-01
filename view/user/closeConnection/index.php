<?php

  session_start();

  //liberamos todas las variables de sesion registradas...
  $_SESSION = array();
  session_destroy();
  echo '<script language = javascript>			
			self.location = "../../"
			</script>';
?>
