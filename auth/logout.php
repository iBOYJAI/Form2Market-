<?php
session_start();
session_destroy();
header('Location: /farm2market/auth/login.php');
exit();
