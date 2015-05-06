<?php

$get = (!empty($_GET)) ? true : false;

if($get){


    $query = stripslashes($_GET['query']);
    $select_city = stripslashes($_GET['select-city']);
    $photographer = stripslashes($_GET['photographer']);
    $model = stripslashes($_GET['model']);

    $error = '';

    if(!$query)
    {
        $error = 'Пожалуйста, введите поисковый запрос. Это важно!<br />';
    }

    if(!$error){

        echo $query . ' ' . $select_city . ' ' . $photographer . ' ' . $model  ;

    }else{
        echo '<div class="bg-danger">'.$error.'</div>';
    }

}
?>
