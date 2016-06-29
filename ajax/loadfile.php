<?php

// Check if we are a user
OCP\JSON::checkLoggedIn();
OCP\JSON::callCheck();

\OC::$server->getSession()->close();

// Set the session key for the file we are about to edit.
$dir = isset($_GET['dir']) ? $_GET['dir'] : '';
$filename = isset($_GET['file']) ? $_GET['file'] : '';
$token = isset($_GET['token']) ? $_GET['token'] : '';
if(!empty($filename))
{
        header('Content-Type: application/pdf');
        
        if(!empty($token))
        {
        	$linkItem = \OC::$server->getShareManager()->getShareByToken($token);
        	$owner = $linkItem->getShareOwner();
        	\OC\Files\Filesystem::init($owner, '/' . $owner . '/files');
        	$dir = '/' . \OC\Files\Filesystem::getPath($linkItem->getNodeId());
        	$dir = rtrim($dir, '/');
        }
        
        $path = $dir.'/'.$filename;
        $filecontents = \OC\Files\Filesystem::file_get_contents($path);

        if($filecontents)
        {
        	echo $filecontents;
        }
        else
        {
        	\OCP\Util::writeLog('files_pdfviewer', 'Error when opening PDF ' . $path, \OCP\Util::ERROR);
        	OCP\JSON::error(['data' => ['message' => 'A problem occoured while loading the PDF']]);
        }
        return;
	
} 
else 
{
	OCP\JSON::error(['data' => ['message' => 'Invalid file path supplied.']]);
}
