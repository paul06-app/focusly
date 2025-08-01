export default function SimplePage() {
  return (
    <html>
      <head>
        <title>Focusly - Test</title>
      </head>
      <body style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h1 style={{ color: '#333', textAlign: 'center' }}>🧠 Focusly</h1>
          <p style={{ textAlign: 'center', color: '#666' }}>Application TDAH/HPI</p>
          
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#333', fontSize: '18px' }}>Fonctionnalités :</h2>
            <ul style={{ color: '#666' }}>
              <li>⏱️ Timer Pomodoro</li>
              <li>📋 Gestion des tâches</li>
              <li>🧠 Jeux cérébraux</li>
              <li>🧘‍♀️ Méditation</li>
              <li>😊 Suivi d'humeur</li>
              <li>📊 Analyses</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Vercel fonctionne !</p>
            <p style={{ color: '#666', fontSize: '14px' }}>Votre application est prête à être installée sur mobile</p>
          </div>
        </div>
      </body>
    </html>
  );
}
