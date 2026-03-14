'use client'

export default function TermsPage() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }

        body { font-family: 'JetBrains Mono', monospace; }

        h1,h2 { font-family:'Syne', sans-serif; }

        .section { margin-bottom:40px; }

        .title {
          font-size:32px;
          font-weight:800;
          margin-bottom:20px;
        }

        .subtitle{
          font-size:14px;
          color:#9ca3af;
          margin-bottom:28px;
          line-height:1.8;
        }

        .block{
          background:rgba(255,255,255,0.02);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:10px;
          padding:22px;
        }

        .block h3{
          color:#f9fafb;
          font-size:14px;
          margin-bottom:10px;
        }

        .block p{
          color:#6b7280;
          font-size:12px;
          line-height:1.8;
        }

      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"#080b0f",
        color:"#e5e7eb",
        position:"relative"
      }}>

        {/* grid background */}
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

          <h1 className="title">
            Terms & <span style={{color:"#ff4545"}}>Conditions</span>
          </h1>

          <p className="subtitle">
            These Terms and Conditions govern your use of CyberSentinel's threat
            analysis platform. By using our services, you agree to comply with
            these terms.
          </p>

          <div className="section block">
            <h3>1. Use of Service</h3>
            <p>
              CyberSentinel provides tools for analyzing URLs and detecting
              phishing or malware threats. The platform is intended strictly for
              cybersecurity research, education, and personal safety purposes.
              Users must not use this service for malicious or illegal activity.
            </p>
          </div>

          <div className="section block">
            <h3>2. Accuracy Disclaimer</h3>
            <p>
              While CyberSentinel uses advanced threat intelligence sources and
              machine learning models, we cannot guarantee 100% accuracy in all
              cases. Users should always apply their own judgment before visiting
              any suspicious link.
            </p>
          </div>

          <div className="section block">
            <h3>3. Community Reports</h3>
            <p>
              Threat data may be contributed by members of the community. We
              attempt to validate and filter these submissions, but CyberSentinel
              is not responsible for inaccuracies in community-submitted data.
            </p>
          </div>

          <div className="section block">
            <h3>4. Prohibited Activities</h3>
            <p>
              Users may not attempt to disrupt the service, scrape data
              excessively, bypass security protections, or reverse engineer any
              part of the CyberSentinel system.
            </p>
          </div>

          <div className="section block">
            <h3>5. Changes to Terms</h3>
            <p>
              CyberSentinel reserves the right to modify these terms at any time.
              Continued use of the platform after updates indicates acceptance of
              the revised terms.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}