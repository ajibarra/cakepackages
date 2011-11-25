<?php
$this->layout = false;
Configure::write('debug', 0);
$result = compact('message', 'status', 'result');
echo json_encode($result);
