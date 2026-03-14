'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SignupPage() {

  const router = useRouter()
  const { status } = useSession()

  const [loadingProvider,setLoadingProvider] = useState<string | null>(null)
  const [mounted,setMounted] = useState(false)

  useEffect(()=>{ setMounted(true) },[])

  useEffect(()=>{
    if(status==='authenticated') router.push('/dashboard')
  },[status,router])

  const startProviderSignIn = async (provider:'google'|'github')=>{

    try{

      setLoadingProvider(provider)

      const res = await signIn(provider,{
        redirect:false,
        callbackUrl:`${window.location.origin}/dashboard`
      } as any)

      if(!res){ setLoadingProvider(null); return }

      if((res as any).error){
        toast.error((res as any).error)
        setLoadingProvider(null)
        return
      }

      if((res as any).url){
        window.location.href=(res as any).url
        return
      }

      router.push('/dashboard')

    }catch(err){
      console.error(err)
      toast.error('Sign-in failed')
      setLoadingProvider(null)
    }

  }

  if(!mounted) return null

  return(
  <>
  <style>{`

  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');

  *{box-sizing:border-box;margin:0;padding:0}

  @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}

  .card{animation:fadeUp .6s ease both}

  .btn{
  transition:.18s
  }

  .btn:hover:not(:disabled){
  transform:translateY(-1px);
  border-color:rgba(255,69,69,.35)!important;
  background:rgba(255,69,69,.05)!important
  }

  .link{
  color:#ff4545;
  text-decoration:none
  }

  .link:hover{
  opacity:.7;
  text-decoration:underline
  }

  `}</style>

  <ToastContainer
  position="top-right"
  toastStyle={{
  background:'#0d1117',
  border:'1px solid rgba(255,69,69,.35)',
  color:'#e5e7eb',
  fontFamily:"'JetBrains Mono', monospace",
  fontSize:12
  }}
  />

  <div style={{
  minHeight:'100vh',
  background:'#080b0f',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  fontFamily:"'JetBrains Mono', monospace",
  position:'relative',
  overflow:'hidden',
  padding:'24px'
  }}>

  {/* grid */}
  <div style={{
  position:'fixed',
  inset:0,
  pointerEvents:'none',
  backgroundImage:'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)',
  backgroundSize:'40px 40px'
  }}/>

  {/* glow */}
  <div style={{
  position:'fixed',
  top:'-15%',
  left:'50%',
  transform:'translateX(-50%)',
  width:700,
  height:400,
  background:'radial-gradient(ellipse, rgba(255,69,69,0.06) 0%, transparent 70%)',
  pointerEvents:'none'
  }}/>

  <div className="card" style={{
  position:'relative',
  zIndex:2,
  width:'100%',
  maxWidth:440,
  background:'rgba(255,255,255,0.02)',
  border:'1px solid rgba(255,255,255,0.08)',
  borderRadius:14,
  overflow:'hidden',
  boxShadow:'0 0 60px rgba(255,69,69,0.08)'
  }}>

  <div style={{height:2,background:'linear-gradient(90deg,#ff4545,#ff6b6b,transparent)'}}/>

  <div style={{padding:'32px'}}>

  {/* badge */}

  <div style={{
  display:'flex',
  alignItems:'center',
  gap:8,
  justifyContent:'center',
  marginBottom:20
  }}>
  <span style={{
  position:'relative',
  display:'inline-flex',
  width:8,
  height:8
  }}>
  <span style={{
  position:'absolute',
  inset:0,
  borderRadius:'50%',
  background:'#ff4545',
  opacity:.4,
  animation:'ping 1.4s cubic-bezier(0,0,0.2,1) infinite'
  }}/>
  <span style={{
  width:8,
  height:8,
  borderRadius:'50%',
  background:'#ff4545'
  }}/>
  </span>

  <span style={{
  fontSize:9,
  color:'#ff4545',
  letterSpacing:'.2em',
  fontWeight:700
  }}>
  CREATE ACCOUNT
  </span>
  </div>

  {/* title */}

  <h1 style={{
  fontFamily:"'Syne', sans-serif",
  fontSize:28,
  fontWeight:800,
  color:'#f9fafb',
  textAlign:'center',
  marginBottom:8
  }}>
  Join <span style={{color:'#ff4545'}}>CyberSentinel</span>
  </h1>

  <p style={{
  fontSize:11,
  color:'#4b5563',
  textAlign:'center',
  marginBottom:24
  }}>
  Create your account to start scanning threats
  </p>

  {/* Google */}

  <button
  className="btn"
  onClick={()=>startProviderSignIn('google')}
  disabled={!!loadingProvider}
  style={{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  gap:10,
  width:'100%',
  padding:'12px',
  background:'rgba(255,255,255,0.03)',
  border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:8,
  color:'#d1d5db',
  fontSize:12,
  fontWeight:600,
  cursor:'pointer',
  marginBottom:10
  }}
  >

  {loadingProvider==='google'
  ?<span style={{
  width:14,
  height:14,
  borderRadius:'50%',
  border:'2px solid rgba(255,255,255,.15)',
  borderTopColor:'#ff4545',
  animation:'spin .7s linear infinite'
  }}/>
  :<>
  <FcGoogle style={{fontSize:18}}/>
  Continue with Google
  </>}

  </button>

  {/* GitHub */}
{/*
  <button
  className="btn"
  onClick={()=>startProviderSignIn('github')}
  disabled={!!loadingProvider}
  style={{
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  gap:10,
  width:'100%',
  padding:'12px',
  background:'rgba(255,255,255,0.03)',
  border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:8,
  color:'#d1d5db',
  fontSize:12,
  fontWeight:600,
  cursor:'pointer'
  }}
  >

  {loadingProvider==='github'
  ?<span style={{
  width:14,
  height:14,
  borderRadius:'50%',
  border:'2px solid rgba(255,255,255,.15)',
  borderTopColor:'#ff4545',
  animation:'spin .7s linear infinite'
  }}/>
  :<>
  <FaGithub style={{fontSize:17}}/>
  Continue with GitHub
  </>}

  </button> */}

  <div style={{
  marginTop:24,
  paddingTop:20,
  borderTop:'1px solid rgba(255,255,255,0.05)',
  textAlign:'center'
  }}>

  <p style={{fontSize:11,color:'#4b5563',marginBottom:8}}>
  Already have an account?{" "}
  <button
  onClick={()=>router.push('/login')}
  style={{
  background:'none',
  border:'none',
  cursor:'pointer',
  color:'#ff4545',
  fontSize:11
  }}>
  Login
  </button>
  </p>

  <p style={{fontSize:10,color:'#374151'}}>
  By continuing you agree to our{" "}
  <a href="/terms" className="link">Terms</a> and{" "}
  <a href="/privacy" className="link">Privacy Policy</a>
  </p>

  </div>

  </div>

  </div>

  </div>
  </>
  )

}