<?php

$serverName = "serverdb";
$database = "database";
$username = "username";
$password = "password";

try {
    $conexao = new PDO("sqlsrv:Server=$serverName;Database=$database", $username, $password);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Erro na conexão: " . $e;
}
