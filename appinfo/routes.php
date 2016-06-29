<?php
/** @var $this OC\Route\Router */
$this->create('files_pdfviewer_load', '/ajax/loadfile.php')
	->actionInclude('files_pdfviewer/ajax/loadfile.php');

$this->create('files_pdfviewer_loadpublic', '/ajax/loadpublicfile.php')
		->actionInclude('files_pdfviewer/ajax/loadpublicfile.php');