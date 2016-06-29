<?php 

// Check if we are a user
//OCP\JSON::checkLoggedIn();
OCP\JSON::callCheck();

\OC::$server->getSession()->close();

// Set the session key for the file we are about to edit.
$token = isset($_GET['token']) ? $_GET['token'] : '';
if(!empty($token))
{
	header('Content-Type: application/pdf');
	
	$linkItem = \OC::$server->getShareManager()->getShareByToken($token);
	$owner = $linkItem->getShareOwner();
	
	\OC\Files\Filesystem::tearDown();
	\OC\Files\Filesystem::init($owner, '/' . $owner . '/files');
	
	$path = '/' . \OC\Files\Filesystem::getPath($linkItem->getNodeId());
	
	$filecontents = \OC\Files\Filesystem::file_get_contents($path);
	
	if($filecontents)
	{
		echo $filecontents;
	}
	else
	{
		\OCP\Util::writeLog('files_nbviewer', 'Error while opening PDF ' . $path, \OCP\Util::ERROR);
		OCP\JSON::error(['data' => ['message' => 'A problem occoured while loading the PDF']]);
	}
	return;

} else {
	OCP\JSON::error(['data' => ['message' => 'Invalid file path supplied.']]);
}