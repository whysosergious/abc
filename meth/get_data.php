<?php

   include("cfg/databs.php");


   if ($_SERVER['REQUEST_METHOD'] === 'POST') {

      $table = $_POST['db_table'];

      $sql = "SELECT * FROM $table";
      $q = $pdo->query($sql);
      $q->setFetchMode(PDO::FETCH_ASSOC);

      $arr = [];

      if ($table == 'menues') {
         $arr[] = 'menu';
         while ($row = $q->fetch()) {
            $arr[] = [$row['id'], $row['file_name'], $row['time_stamp'],$row['file_size'], $row['file_path'], $row['author']];
         }
      } else if ($table == 'lunch_pages' ||
         $table == 'drinks_pages' ||
         $table == 'food_pages') {
            $arr[] = $table;
            while ($row = $q->fetch()) {
               $arr[] = [$row['file_name'], $row['file_size'], $row['file_path']];
            }
      } else if ($table == 'reghours') {
         $arr[] = 'reghours';
         while ($row = $q->fetch()) {
            $arr[] = [$row['reg_id'], $row['reg_day'], $row['reg_closed'], $row['regular_hours'], $row['time_stamp'], $row['author']];
         }
      } else if ($table == 'exception_hours') {
         $arr[] = 'exception_hours';
         $sql = "SELECT * FROM exception_hours ORDER BY db_id ASC";
         $q = $pdo->query($sql);

         while ($row = $q->fetch()) {
            $arr[] = [$row['db_id'], $row['group_title'], $row['exc_id'], $row['host_id'], $row['exc_date'], $row['exc_hours'], $row['exc_closed'], $row['time_stamp'], $row['author']];
         }
      } else if ($table == 'users') {
         $arr[] = 'users';

         while ($row = $q->fetch()) {
            $arr[] = [$row['db_id'], $row['user_name'], $row['user_email'], $row['user_pass'], $row['user_role'], $row['time_stamp'], $row['user_icon']];
         }
      } else if ($table == 'image_gallery') {
         $arr[] = 'image_gallery';

         while ($row = $q->fetch()) {
            $arr[] = [$row['img_mid']];
            // $arr[] = [$row['db_id'], $row['img_id'], $row['img_title'], $row['img_url'], $row['img_size'], $row['img_type'], $row['img_asra'], $row['img_mid'], $row['mid_size'], $row['img_tiny'], $row['tiny_size']];
         }
      }

      if (count($arr) <= 1) {
         $arr[] = 'empty';
      }

      echo json_encode($arr);
   }
?>