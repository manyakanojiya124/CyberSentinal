'use client'

export default function PrivacyPage() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');

        * { box-sizing:border-box; margin:0; padding:0; }

        h1,h2 { font-family:'Syne', sans-serif; }

        .section { margin-bottom:40px; }

        .block{
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;
          padding:22px;
        }

        .block h3{
          font-size:14px;
          margin-bottom:10px;
          color:#f9fafb;
        }

        .block p{
          font-size:12px;
          color:#6b7280;
          line-height:1.8;
        }

      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"#080b0f",
        color:"#e5e7eb"
      }}>

        {/* background grid */}
        <div style={{
          position:"fixed",
          inset:0,
          pointerEvents:"none",
          backgroundImage:
          "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize:"40px 40px"
        }}/>

        <div style={{
          maxWidth:900,
          margin:"0 auto",
          padding:"80px 24px",
          position:"relative",
          zIndex:1
        }}>

          <h1 style={{
            fontSize:32,
            fontWeight:800,
            marginBottom:20
          }}>
            Privacy <span style={{color:"#ff4545"}}>Policy</span>
          </h1>

          <p style={{
            fontSize:14,
            color:"#9ca3af",
            marginBottom:30,
            lineHeight:1.8
          }}>
            CyberSentinel respects your privacy and is committed to protecting
            your personal information.
          </p>

          <div className="section block">
            <h3>1. Information We Collect</h3>
            <p>
              We may collect URLs submitted for analysis, anonymized usage data,
              and optional account information such as email addresses used for
              authentication.
            </p>
          </div>

          <div className="section block">
            <h3>2. How We Use Data</h3>
            <p>
              Submitted URLs are analyzed to detect phishing, malware, and other
              threats. Aggregated data may also be used to improve detection
              algorithms and enhance community threat intelligence feeds.
            </p>
          </div>

          <div className="section block">
            <h3>3. Data Security</h3>
            <p>
              We implement security measures to protect data from unauthorized
              access. However, no online platform can guarantee absolute
              security.
            </p>
          </div>

          <div className="section block">
            <h3>4. Third-Party Services</h3>
            <p>
              CyberSentinel may integrate with external threat intelligence
              providers such as VirusTotal or other security APIs to analyze
              suspicious URLs.
            </p>
          </div>

          <div className="section block">
            <h3>5. User Rights</h3>
            <p>
              Users may request removal of their account data or inquire about
              stored information by contacting the CyberSentinel support team.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}