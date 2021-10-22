Function GetCredential([ref]$path) {
	if (Test-Path 'env:SANDFOX') {
		$sandFoxPath = $Env:SANDFOX
		# $sandFoxPath = Get-Variable SANDFOX -valueOnly

		if (Test-Path "$sandFoxPath/$credentialPath") {
			$path.Value = "$sandFoxPath/$credentialPath"
		} else {
			throw "CREDENTIALS not found need to exists: $currentPath/$credentialPath !"
		}
	} elseIf (Test-Path "$currentPath/$credentialPath") {
		$path.Value = "$currentPath/$credentialPath"
	} elseIf (Test-Path "$HOME/$credentialPath") {
		$path.Value = "$HOME/$credentialPath"
	} else {
		throw "CREDENTIALS not found need to exists: $credentialPath !"
	}
}


$currentPath = Get-Location

$configPath = "$currentPath/config/sandfox-config.json"
$credentialPath = "credentials/gd-drive-access.json"

GetCredential -path ([ref]$credentialPath)

if (Test-Path 'env:SANDFOX') {
	$sandFoxPath = $Env:SANDFOX
	# $sandFoxPath = Get-Variable SANDFOX -valueOnly

	Set-Location "$sandFoxPath"

	Write-Output "node dist/main.js --customDir $currentPath --credential $credentialPath --config $configPath generate"

	node dist/main.js --customDir "$currentPath" --credential "$credentialPath" --config "$configPath" generate

	Start-Sleep -s 2

	node dist/main.js --customDir "$currentPath" --credential "$credentialPath" --config "$configPath" custom
} else {
	Write-Output 'SANDFOX Environment variable not set! Fallback to NPX...'

	Write-Output "npx sandfox-gen-jpa --config $configPath generate"

	Write-Output $credentialPath

	npx sandfox-gen-jpa --credential "$credentialPath" --config "$configPath" generate

	Start-Sleep -s 2

	npx sandfox-gen-jpa --customDir "$currentPath" --credential "$credentialPath" --config "$configPath" custom
}
