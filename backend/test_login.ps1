# Test login with curl
$headers = @{
    "Content-Type" = "application/json"
}

$credentials = @(
    @{userId="faculty_test"; password="Faculty@123"; role="Faculty"},
    @{userId="admin_test"; password="Admin@123"; role="Admin"},
    @{userId="hod_test"; password="HOD@123"; role="HOD"}
)

Write-Host "Testing Login Endpoint with Curl"
Write-Host ("=" * 70)

foreach ($cred in $credentials) {
    Write-Host "`nTesting $($cred.role) login..."
    $body = @{
        userId = $cred.userId
        password = $cred.password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://127.0.0.1:5000/login" -Method Post -Body $body -Headers $headers
        Write-Host "  [SUCCESS] Login successful"
        Write-Host "  Name: $($response.name)"
        Write-Host "  Role: $($response.role)"
        Write-Host "  Dept: $($response.dept)"
    } catch {
        Write-Host "  [ERROR] $($_.Exception.Message)"
    }
}
