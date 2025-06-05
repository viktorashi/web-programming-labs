<?php
$v = array(1 => 2, 2 => "zz", "vect" => [2, 3, 4]);
// echo var_dump($v);
foreach ($v as $key => $val) {
    echo json_encode($key) . "=>" . json_encode($val) . "\n";
}
