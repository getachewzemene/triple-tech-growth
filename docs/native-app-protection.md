# Native App Anti-Capture Protection Snippets

## Android (Kotlin) - Screen Recording/Screenshot Protection

```kotlin
// MainActivity.kt or in your video activity
import android.view.WindowManager
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class VideoPlayerActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Prevent screenshots and screen recording
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        
        setContentView(R.layout.activity_video_player)
        
        // Additional security measures
        preventDebugging()
        detectScreenRecording()
    }
    
    private fun preventDebugging() {
        // Detect if app is being debugged
        if (android.os.Debug.isDebuggerConnected() || 
            android.os.Debug.waitingForDebugger()) {
            // Close app or show warning
            finish()
        }
    }
    
    private fun detectScreenRecording() {
        // Monitor for screen recording apps (requires additional permissions)
        val projection = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        
        // Register callback to detect screen capture
        projection.createScreenCaptureIntent()
        
        // You can also check for known screen recording apps
        val packageManager = packageManager
        val screenRecordingApps = listOf(
            "com.hecorat.screenrecorder.free",
            "com.kimcy929.screenrecorder",
            "com.nll.screenrecorder"
            // Add more known screen recording app package names
        )
        
        screenRecordingApps.forEach { packageName ->
            try {
                packageManager.getPackageInfo(packageName, 0)
                // Screen recording app detected - take action
                showSecurityWarning()
            } catch (e: PackageManager.NameNotFoundException) {
                // App not installed - OK
            }
        }
    }
    
    private fun showSecurityWarning() {
        AlertDialog.Builder(this)
            .setTitle("Security Warning")
            .setMessage("Screen recording applications detected. Video playback has been disabled for security reasons.")
            .setPositiveButton("OK") { _, _ -> finish() }
            .setCancelable(false)
            .show()
    }
    
    override fun onResume() {
        super.onResume()
        // Re-check security when app resumes
        preventDebugging()
    }
}
```

## iOS (Swift) - Screen Recording Detection

```swift
// VideoPlayerViewController.swift
import UIKit
import AVFoundation

class VideoPlayerViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Set up screen recording detection
        setupScreenRecordingDetection()
        
        // Prevent screenshots (limited effectiveness)
        setupScreenshotPrevention()
    }
    
    private func setupScreenRecordingDetection() {
        // Monitor screen capture status changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenCaptureDidChange),
            name: UIScreen.capturedDidChangeNotification,
            object: nil
        )
        
        // Initial check
        checkScreenRecordingStatus()
    }
    
    @objc private func screenCaptureDidChange() {
        DispatchQueue.main.async {
            self.checkScreenRecordingStatus()
        }
    }
    
    private func checkScreenRecordingStatus() {
        if UIScreen.main.isCaptured {
            // Screen recording detected
            handleScreenRecordingDetected()
        } else {
            // Screen recording stopped
            handleScreenRecordingStopped()
        }
    }
    
    private func handleScreenRecordingDetected() {
        // Pause video playback
        pauseVideo()
        
        // Show warning to user
        showScreenRecordingAlert()
        
        // Optionally notify server
        notifyServerOfSecurityBreach()
        
        // Blur or hide content
        blurVideoContent()
    }
    
    private func handleScreenRecordingStopped() {
        // Remove blur and allow playback to resume
        unblurVideoContent()
        dismissSecurityAlert()
    }
    
    private func showScreenRecordingAlert() {
        let alert = UIAlertController(
            title: "Screen Recording Detected",
            message: "Video playback has been paused because screen recording was detected. Please stop screen recording to continue.",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    private func setupScreenshotPrevention() {
        // Add a blur view that appears during screenshots
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appWillResignActive),
            name: UIApplication.willResignActiveNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(appDidBecomeActive),
            name: UIApplication.didBecomeActiveNotification,
            object: nil
        )
    }
    
    @objc private func appWillResignActive() {
        // Add blur view to prevent screenshot content capture
        addBlurView()
    }
    
    @objc private func appDidBecomeActive() {
        // Remove blur view when app becomes active
        removeBlurView()
    }
    
    private func addBlurView() {
        let blurEffect = UIBlurEffect(style: .dark)
        let blurView = UIVisualEffectView(effect: blurEffect)
        blurView.frame = view.bounds
        blurView.tag = 999 // Tag for easy removal
        view.addSubview(blurView)
    }
    
    private func removeBlurView() {
        view.subviews.forEach { subview in
            if subview.tag == 999 {
                subview.removeFromSuperview()
            }
        }
    }
    
    private func blurVideoContent() {
        // Add blur effect to video player
        let blurEffect = UIBlurEffect(style: .dark)
        let blurView = UIVisualEffectView(effect: blurEffect)
        blurView.frame = videoPlayerView.bounds
        blurView.tag = 998
        videoPlayerView.addSubview(blurView)
    }
    
    private func unblurVideoContent() {
        videoPlayerView.subviews.forEach { subview in
            if subview.tag == 998 {
                subview.removeFromSuperview()
            }
        }
    }
    
    private func notifyServerOfSecurityBreach() {
        // Send security event to server
        let url = URL(string: "https://your-api.com/api/security/breach")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let payload = [
            "event": "screen_recording_detected",
            "timestamp": ISO8601DateFormatter().string(from: Date()),
            "device_id": UIDevice.current.identifierForVendor?.uuidString ?? "unknown",
            "user_id": getCurrentUserId()
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: payload)
            URLSession.shared.dataTask(with: request).resume()
        } catch {
            print("Failed to notify server of security breach: \(error)")
        }
    }
    
    private func getCurrentUserId() -> String {
        // Return current user ID from your auth system
        return UserDefaults.standard.string(forKey: "userId") ?? "anonymous"
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
```