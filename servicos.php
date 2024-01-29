<?php

require_once './conexao.php';
require_once './recursos/tcpdf/tcpdf.php';

$servico = $_GET['s'];

switch ($servico) {
    case 'buscarUsuario':

        if(!isset($_POST['senha']))
            die();

        $senha = $_POST['senha'];
        
        $query = "SELECT C.NOMEPACIENTE, FORMAT(C.DATANASC, 'dd/MM/yyyy') as 'DATANASC', S.SEQSENHA, C.CODCOLIGADA, C.IDUNIDATEND, C.SENHA, C.FASE FROM SZCLASSIFICACAORISCO C INNER JOIN SZSENHACLASSIF S ON (C.CODCOLIGADA = S.CODCOLIGADA AND C.CODIGO = S.SEQSENHA AND S.IDUNIDATEND = C.IDUNIDATEND) WHERE C.RECCREATEDON >= DATEADD(day, -1, GETDATE()) AND C.SENHA = :senha";

        $statement = $conexao->prepare($query);
        $statement->bindParam(':senha', $senha);
        $statement->execute();
        
        $usuario = $statement->fetchObject();

        if ($usuario) {
            echo json_encode($usuario);
        } else {
            echo json_encode(null);
        }

        break;

    case 'finalizarTriagem':

        if(!isset($_POST['prioridade']) || !isset($_POST['sintomas']) || !isset($_POST['usuario']))
            die();

        $prioridade = $_POST['prioridade'];
        $sintomas = $_POST['sintomas'];
        $usuario = $_POST['usuario'];

        //CODCOLIGADA, SEQSENHA, IDUNIDATEND, SENHA
        $query = "UPDATE SZSENHACLASSIF set FASE = 3 where SEQSENHA = :seqsenha AND CODCOLIGADA = :codcoligada AND IDUNIDATEND = :idunidatend AND SENHA = :senha";

        $statement = $conexao->prepare($query);
        $statement->bindParam(':senha', $usuario['SENHA']);
        $statement->bindParam(':seqsenha', $usuario['SEQSENHA']);
        $statement->bindParam(':idunidatend', $usuario['IDUNIDATEND']);
        $statement->bindParam(':codcoligada', $usuario['CODCOLIGADA']);

        $statement->execute();

        //PRIORIDADE(VALOR), CODCOLIGADA, CODIGO(SEQSENHA), IDUNIDATEND, SENHA
        $query = "UPDATE SZCLASSIFICACAORISCO set FASE = 3, VALOR = :prioridade, IDQUEIXAPRINCIPAL = (SELECT VALAUTOINC FROM GAUTOINC WHERE CODAUTOINC = 'SZIDMEMO' AND CODCOLIGADA = :codcoligada1) + 1 where CODIGO = :seqsenha AND CODCOLIGADA = :codcoligada2 AND IDUNIDATEND = :idunidatend AND SENHA = :senha";

        $statement = $conexao->prepare($query);
        $statement->bindParam(':senha', $usuario['SENHA']);
        $statement->bindParam(':seqsenha', $usuario['SEQSENHA']);
        $statement->bindParam(':idunidatend', $usuario['IDUNIDATEND']);
        $statement->bindParam(':codcoligada1', $usuario['CODCOLIGADA']);
        $statement->bindParam(':codcoligada2', $usuario['CODCOLIGADA']);
        $statement->bindParam(':prioridade', $prioridade);

        $statement->execute();

        //CODCOLIGADA
        $query = "UPDATE GAUTOINC SET VALAUTOINC = VALAUTOINC + 1 WHERE CODAUTOINC = 'SZIDMEMO' AND CODCOLIGADA = :codcoligada";
        
        $statement = $conexao->prepare($query);
        $statement->bindParam(':codcoligada', $usuario['CODCOLIGADA']);

        $statement->execute();
        
        //CODCOLIGADA, SINTOMAS
        $query = "INSERT INTO SZMEMO(IDMEMO, VALMEMO, CODCOLIGADA) VALUES ((SELECT VALAUTOINC FROM GAUTOINC WHERE CODAUTOINC = 'SZIDMEMO' AND CODCOLIGADA = :codcoligada1), :sintomas, :codcoligada2)";

        $statement = $conexao->prepare($query);
        $statement->bindParam(':sintomas', $sintomas);
        $statement->bindParam(':codcoligada1', $usuario['CODCOLIGADA']);
        $statement->bindParam(':codcoligada2', $usuario['CODCOLIGADA']);

        $statement->execute();

        //IMPRIME A ETIQUETA

        $pdf = new TCPDF('L', 'mm', array(40, 80), true, 'UTF-8');
        $pdf->SetPrintHeader(false);
        $pdf->SetAutoPageBreak(false);
        $pdf->AddPage();
        
        if($prioridade == 100) {
            $prioridadeTexto = 'VERMELHO';
        } else if($prioridade == 10) {
            $prioridadeTexto = 'LARANJA';
        } else if($prioridade == 5) {
            $prioridadeTexto = 'AMARELO';
        } else if($prioridade == 1) {
            $prioridadeTexto = 'VERDE';
        } else {
            $prioridadeTexto = 'AZUL';
        }

        // PRIORIDADE
        $pdf->SetFont('helvetica', '', 8);
        $pdf->SetXY(2, 2);
        $pdf->MultiCell(40, 4, 'PRIORIDADE DO PACIENTE', 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);
        
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetXY(2, 5);
        $pdf->MultiCell(38, 4, $prioridadeTexto, 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);

        // NOME
        $pdf->SetFont('helvetica', '', 7);
        $pdf->SetXY(2, 24);
        $pdf->MultiCell(38, 4, 'NOME DO PACIENTE', 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);

        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->SetXY(2, 26.5);
        $pdf->MultiCell(38, 4, $usuario["NOMEPACIENTE"], 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);

        // NASCIMENTO
        $pdf->SetFont('helvetica', '', 5);
        $pdf->SetXY(2, 34);
        $pdf->MultiCell(38, 4, 'DATA DE NASCIMENTO', 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);
    
        $pdf->SetFont('helvetica', 'B', 6);
        $pdf->SetXY(23, 33.75);
        $pdf->MultiCell(38, 4, $usuario["DATANASC"], 0, 'L', false, 0, '', '', true, 0, false, true, 0, 'T', false);

        // SENHA
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetXY(2, 30.5);
        $pdf->MultiCell(74, 4, $usuario["SENHA"], 0, 'R', false, 0, '', '', true, 0, false, true, 0, 'T', false);

        $pdf->Image('C:\\Users\\rogerio.leachenski\\Documents\\triagem\\recursos\\imagens\\logo.png', 58, 3, 18.51, 8.16, 'PNG', '', '', false, 300, '', false, false, 0, false, false, false);

        $caminhoArquivoPDF = 'C:\\Users\\rogerio.leachenski\\Documents\\triagem\\etiquetas\\'.date('YmdHis').str_replace(' ', '', $usuario["SENHA"]).'.pdf';

        $pdf->Output($caminhoArquivoPDF, 'F');

        //shell_exec('AcroRd32.exe /t "' . $caminhoArquivoPDF . '"');

        echo json_encode(0);
        
        
}

die();

?>