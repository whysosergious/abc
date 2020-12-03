<?php 
// die( var_dump($new_item ));
   include("cfg/databs.php");


   function formatBytes($size, $precision = 1) {

      $base = log($size, 1024);
      $suffixes = array('', 'kb', 'mb', 'gb', 'tb');   
      return round(pow(1024, $base - floor($base)), $precision) . $suffixes[floor($base)];
   }
  
   if ($_SERVER['REQUEST_METHOD'] === 'POST') {

      $last_id = null;
      
      // delete group entry and all of its children
      if ($_POST['db_table'] == 'delete_group') {

         $tgt_table = $_POST['tgt_table'];
         $delete_queue = $_POST['delete_queue'];

         $entries = implode(',', $delete_queue);
         $sql = "DELETE from $tgt_table WHERE db_id IN ($entries)";

         $stmt = $pdo->prepare($sql);

         if ($stmt->execute()) {
            // .. entries deleted
         }
      }


      if ($_POST['db_table'] == 'users') {

         $db_id = $_POST['db_id'];
         $user_id = $_POST['user_id'];
         $user_name = $_POST['user_name'];
         $user_email = $_POST['user_email'];
         $user_pass = $_POST['user_pass'];
         $user_role = $_POST['user_role'];
         $user_icon = $_POST['user_icon'];


         if ($db_id == 'null') {
            
            $sql = "INSERT INTO users (user_name, user_email, user_pass, user_role, user_icon) VALUES ('$user_name', '$user_email', '$user_pass', '$user_role', '$user_icon')";

         } else {

            $sql = "UPDATE users SET user_name='$user_name', user_email='$user_email', user_pass='$user_pass', user_role='$user_role', user_icon='$user_icon' WHERE db_id='$db_id'";
         }

         $stmt = $pdo->prepare($sql);

         if ($stmt->execute()) {
            // .. done
            if ($db_id == 'null') {
               $last_id = $pdo->lastInsertId();
               $response = ["dbRes", [$user_id, $last_id]];
               echo json_encode($response);
            }
         }
      }


      // business hour exceptions
      if ($_POST['db_table'] == 'exception_hours') {

         $db_host_id = $_POST['db_host_id'];
         $group_title = $_POST['group_title'];
         $host_id = $_POST['host_id'];
         $author = $_POST['author'];
         $exc_date = '_______';
         $exc_hours = '_______';
         $exc_closed = '_______';
         $delete_queue = $_POST['delete_queue'];

         // delete any queued entries
         if (isset($delete_queue[0])) {

            $entries = implode(',', $delete_queue);
            $sql = "DELETE from exception_hours WHERE db_id IN ($entries)";

            $stmt = $pdo->prepare($sql);

            if ($stmt->execute()) {
               // .. entries deleted
            }
         }

         if ($db_host_id == 'null') {

            $sql = "INSERT INTO exception_hours
               (group_title, exc_id, host_id,
               exc_date, exc_hours, exc_closed, author)
            
               VALUES
               ('$group_title', '$host_id', 'host',
               '$exc_date', '$exc_hours', '$exc_closed', '$author')
            ";

         } else {

            $sql = "UPDATE exception_hours SET
            
               group_title = '$group_title',
               time_stamp = NOW(),
               author = '$author'

            WHERE db_id='$db_host_id'";

         }

         $stmt = $pdo->prepare($sql);

         if ($stmt->execute()) {
            // .. if the group is new
            // .. get last id after insert
            if ($db_host_id == 'null') {
               $last_id = $pdo->lastInsertId();
               $response[0] = "dbRes";
               $response[] = [$host_id, $last_id];
            }

            $all_exc = isset($_POST['exc_date']) ? count($_POST['exc_date']) : 0;
           

            for ($i = 0; $i < $all_exc; $i++) {

               $db_id = $_POST['db_id'][$i];
               $exc_id = $_POST['exc_id'][$i];
               $exc_date = $_POST['exc_date'][$i];
               $exc_hours = $_POST['exc_hours'][$i];
               $exc_closed = $_POST['exc_closed'][$i];

               if ($db_id == 'null') {

                  $sql = "INSERT INTO exception_hours
                     (group_title, exc_id, host_id, exc_date,
                     exc_hours, exc_closed, author)

                     VALUES
                     ('$group_title', '$exc_id', '$host_id', '$exc_date',
                     '$exc_hours', '$exc_closed', '$author')
                  ";

               } else {

                  $sql = "UPDATE exception_hours SET 
                  
                     group_title = '$group_title',
                     exc_date = '$exc_date',
                     exc_hours = '$exc_hours',
                     exc_closed = '$exc_closed',
                     author = '$author'

                  WHERE db_id='$db_id'";
               }

               $stmt = $pdo->prepare($sql);
   
               if ($stmt->execute()) {
                  // .. One child per loop
                  // .. yes I should collect them
                  // .. and query at all at once..
                  if ($db_id == 'null') {
                     $last_id = $pdo->lastInsertId();
                     $response[0] = "dbRes";
                     $response[] = [$exc_id, $last_id];
                  }
               }
            }

            // return json with database id if new entries were added
            if (isset($response[0])) echo json_encode($response);
         }
      }


      
      if ($_POST['db_table'] == 'image_gallery') {

         $path = 'uploads/gallery/';
         $size_limit = 5666097152445;
         $extensions = ['jpg', 'jpeg', 'png'];

         $author = $_POST['author'];
         
         $file_count = count($_POST['img_title']);

         for ($i = 0; $i < $file_count; $i++) {

            $db_id = $_POST['db_id'][$i];
            $album = $_POST['album'][$i];
            $img_id = $_POST['img_id'][$i];
            $img_title = $_POST['img_title'][$i];
            $img_size = $_POST['img_size'][$i];
            $img_type = $_POST['img_type'][$i];
            $img_ext = $_POST['img_ext'][$i];
            $img_asra = $_POST['img_asra'][$i];
            $img_mid = $_POST['img_mid'][$i];
            $mid_size = $_POST['mid_size'][$i];
            $img_tiny = $_POST['img_tiny'][$i];
            $tiny_size = $_POST['tiny_size'][$i];
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file = $path . $file_name;

            if (move_uploaded_file($file_tmp, $file)) {

               $sql = "INSERT INTO image_gallery
                  (album, img_id, img_title, img_url, img_size, img_type, img_ext, 
                  img_asra, img_mid, mid_size, img_tiny, tiny_size, author)

                  VALUES
                  ('$album', '$img_id', '$img_title', '$file', '$img_size', '$img_type', '$img_ext', 
                  '$img_asra', '$img_mid', '$mid_size', '$img_tiny', '$tiny_size', '$author')
               ";


               $stmt = $pdo->prepare($sql);


               if ($stmt->execute()) {
                  // .. upload successfull
                  if ($db_id == 'null') {
                     $last_id = $pdo->lastInsertId();
                     $response[0] = "dbGalRes";
                     $response[] = [$img_id, $last_id];
                  }
               }
            }
         }
         echo json_encode($response);
      }

      

      // regular hours
      if ($_POST['db_table'] == 'reghours') {
         

         for ($i = 0; $i<8; $i++) {
            
            $day = $_POST['day'][$i];
            // $id = $i;
            $id = $day == 'sunday' ? 0 : $i + 1;

            $closed = $_POST['closed'][$i];
            $regular_hours = $_POST['hours'][$i];
            $author = $_POST['author'][$i];

            

            $sql = "UPDATE reghours SET 
               reg_closed='$closed', 
               regular_hours='$regular_hours', 
               author='$author' 
            WHERE reg_id='$id'";

            $stmt = $pdo->prepare($sql);


            if ($stmt->execute()) {
               // .. upload successfull
               // $response[] = [$regular_hours];
            }
         }
         // echo json_encode($response);
      }

      if ($_POST['db_table'] == 'menues') {

         $path = 'uploads/';
         $size_limit = 2097152445;
         $extensions = ['jpg', 'jpeg', 'png', 'pdf'];

         $all_files = count($_FILES['files']['tmp_name']);

         for ($i = 0; $i < $all_files; $i++) {

            $errors = [];

            $id = $_POST['id'];
            $author = $_POST['author'];

            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];

            $file_size_human = formatBytes($file_size);
            $file_ext_TEMP = explode('.', $file_name);
            $file_ext = strtolower(end($file_ext_TEMP));

            $file = $path . $file_name;

            // usefull for images
            // if (file_exists($file)) $errors[] = 'A file with the same name already exists in target path';
            
            // if (!in_array($file_ext, $extensions)) $errors[] = 'Has an invalid file type';

            // if ($file_size > $size_limit) $errors[] = 'Exceeds size limit';

            if (empty($errors) && move_uploaded_file($file_tmp, $file)) {

               // $sql = "INSERT INTO menues (id, file_name, file_size, file_path, author) VALUES ('$id', '$file_name', '$file_size_human', '$file', '$author')";

               $sql = "UPDATE menues SET file_name='$file_name', file_size='$file_size_human', file_path='$file', author='$author' WHERE id='$id'";

               



               $stmt = $pdo->prepare($sql);


               if ($stmt->execute()) {
                  // .. upload successfull
                  // $response[] = [$file_name . " uploaded"];

                  $pages_table = $id . '_pages';

                  $sql = "DELETE FROM $pages_table";

                  $stmt = $pdo->prepare($sql);
                  
                  if ($stmt->execute()) {
                     // .. upload preview pages
                     // $response[] = ["All rows deleted in " . $pages_table];

                     $all_pages = count($_POST['pages_size']);
                     
   
                     for ($p = 0; $p < $all_pages; $p++) {
   
                        $page_name = $_POST['pages_name'][$p];
                        $page_size = $_POST['pages_size'][$p];
                        $page = $_POST['pages_url'][$p];
   
                        $sql = "INSERT INTO $pages_table (file_name, file_size, file_path) VALUES ('$page_name', '$page_size', '$page')";
   
                        $stmt = $pdo->prepare($sql);
   
                        if ($stmt->execute()) {
                           // .. upload successfull
                           // $response[] = [$page_name . " uploaded"];
                        }
                     }
                  }
               }               
            }

            // $response[] = [$file_name, $errors];
         }

         // echo json_encode($response);
      }
   }

?>