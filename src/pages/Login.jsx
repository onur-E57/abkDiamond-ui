import React, { useState, useRef } from 'react';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { faGoogle, faFacebookF, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // İki ayrı input için iki ayrı referans
  const loginPasswordRef = useRef(null);
  const registerPasswordRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ŞİFRE GÖSTER/GİZLE VE İMLEÇ AYARI ---
  const handleTogglePassword = (e, targetRef) => {
    e.preventDefault();

    const input = targetRef.current;
    if (!input) return;

    // İmlecin mevcut konumunu al
    const cursorPosition = input.selectionStart;

    // Şifreyi göster/gizle
    setShowPassword(!showPassword);

    // React render ettikten sonra imleci eski yerine koy
    setTimeout(() => {
      input.setSelectionRange(cursorPosition, cursorPosition);
      input.focus();
    }, 0);
  };

  // --- GİRİŞ YAPMA ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    localStorage.removeItem('token');
    
    try {
      const response = await login({ username, password });
      
      if (response.token || response.accessToken) {
          localStorage.setItem('token', response.token || response.accessToken);
          window.dispatchEvent(new Event("auth-change"));
          toast.success("Hoş geldiniz! Giriş Başarılı.");
          navigate('/'); 
      } else { 
          setError("Sunucudan token alınamadı."); 
      }
    } catch (err) { 
      console.error(err);
      toast.error("Giriş başarısız! E-posta veya şifre hatalı.");
    }
  };

  // --- KAYIT OLMA ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); setSuccessMsg(null);
    
    if(!username || !password || !email) {
        return setError("Lütfen zorunlu alanları doldurunuz.");
    }

    const newUser = {
      username, password, email,
      firstName: firstName || "Misafir",
      lastName: lastName || "Kullanıcı",
      phoneNumber: "5555555555",
      active: true
    };

    try {
      await register(newUser);
      setSuccessMsg("Kayıt Başarılı! Giriş paneline yönlendiriliyorsunuz...");
      
      setTimeout(() => {
        setIsRightPanelActive(false);
        setSuccessMsg(null);
        setPassword('');
      }, 2000);

    } catch (err) { 
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      setError('Kayıt başarısız: ' + msg); 
    }
  };

  return (
    <div className="auth-page-wrapper page-padding-top page-padding-top-custom-loginPage">
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* --- 1. KAYIT OLMA FORMU (SIGN UP) --- */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1 className="auth-title">Hesap Oluştur</h1>
            
            <div className="social-container">
              <a href="#" className="social"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
            
            <span>veya email ile kayıt ol</span>
            
            <div className="auth-input-group">
              <input className="auth-input" type="text" placeholder="Kullanıcı Adı *" value={username} onChange={e => setUsername(e.target.value)} />
              <input className="auth-input" type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)} />
              
              <div className="password-wrapper">
                <input 
                  className="auth-input" 
                  ref={registerPasswordRef} // DÜZELTME: Kayıt ref'i kullanıldı
                  type={showPassword ? "text" : "password"} 
                  placeholder="Şifre *" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                
                <button
                  type="button"
                  className="toggle-password-btn"
                  // DÜZELTME: onClick kaldırıldı, ref parametre olarak geçildi
                  onMouseDown={(e) => handleTogglePassword(e, registerPasswordRef)}
                  title={showPassword ? "Gizle" : "Göster"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>   

              <div className="name-inputs">
                <input className="auth-input" type="text" placeholder="Ad" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input className="auth-input" type="text" placeholder="Soyad" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <button className="btn-auth">Kayıt Ol</button>

            <p className="mobile-toggle-text" onClick={() => setIsRightPanelActive(false)}>
              Zaten hesabın var mı? Giriş Yap
            </p>

            {error && <p style={{color:'red', marginTop:'10px', fontSize:'0.9rem'}}>{error}</p>}
            {successMsg && <p style={{color:'green', marginTop:'10px', fontSize:'0.9rem'}}>{successMsg}</p>}
          </form>
        </div>

        {/* --- 2. GİRİŞ YAPMA FORMU (SIGN IN) --- */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1 className="auth-title">Giriş Yap</h1>
            
            <div className="social-container">
              <a href="#" className="social"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#" className="social"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            </div>
            
            <span className="social-container-span">Hesabınızla devam edin</span>
            
            <div className="auth-input-group">
              <input 
                className="auth-input" 
                type="text" 
                name="username"
                placeholder="Kullanıcı Adı" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
              />
              <div className="password-wrapper">
                <input 
                  className="auth-input"
                  ref={loginPasswordRef} // DÜZELTME: Login ref'i kullanıldı
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  placeholder="Şifre" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                
                <button
                  type="button"
                  className="toggle-password-btn"
                  // DÜZELTME: onClick kaldırıldı, ref parametre olarak geçildi
                  onMouseDown={(e) => handleTogglePassword(e, loginPasswordRef)}
                  title={showPassword ? "Gizle" : "Göster"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>
            </div>
            
            <a href="#" className="forgot-password">Şifrenizi mi unuttunuz?</a>
            
            <button className="btn-auth">Giriş Yap</button>

            <p className="mobile-toggle-text" onClick={() => setIsRightPanelActive(true)}>
              Hesabın yok mu? Kayıt Ol
            </p>

            {error && <p style={{color:'red', marginTop:'10px', fontSize:'0.9rem'}}>{error}</p>}
          </form>
        </div>

        {/* --- OVERLAY KISMI (Değişiklik Yok) --- */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="auth-title gold">Hoş Geldiniz!</h1>
              <p>Zaten bir hesabınız varsa, giriş yaparak ışıltılı dünyamıza dönün.</p>
              <button className="btn-auth ghost" onClick={() => setIsRightPanelActive(false)}>
                Giriş Yap
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="auth-title gold">Merhaba!</h1>
              <p>ABK Diamond'ın eşsiz ayrıcalıklarından yararlanmak için hemen üye olun.</p>
              <button className="btn-auth ghost" onClick={() => setIsRightPanelActive(true)}>
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;