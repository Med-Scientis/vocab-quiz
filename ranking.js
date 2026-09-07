const API='https://cmzcnmnkfpjxbpgsvhsh.supabase.co/functions/v1/vocab-leaderboard';

function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

function html(data){
  if(!data?.length) return '<p class="muted">아직 기록이 없습니다.</p>';
  return '<table><tr><th>순위</th><th>닉네임</th><th>점수</th><th>정답률</th></tr>'+
    data.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.nickname)}</td><td>${r.score}/${r.total}</td><td>${Math.round(r.score/r.total*100)}%</td></tr>`).join('')+
    '</table>';
}

export async function loadRanking(setName,target){
  if(!target) return;
  target.innerHTML='<p class="muted">랭킹 불러오는 중...</p>';
  try{
    const r=await fetch(`${API}?set=${encodeURIComponent(setName)}`);
    const b=await r.json();
    if(!r.ok) throw new Error(b.error||'불러오기 실패');
    target.innerHTML=html(b.data);
  }catch(e){target.innerHTML='<p class="muted">랭킹을 불러오지 못했습니다.</p>';}
}

export async function saveScore(nickname,vocabSet,score,total,statusEl){
  try{
    const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nickname,vocab_set:vocabSet,score,total})});
    const b=await r.json();
    if(!r.ok) throw new Error(b.error||'저장 실패');
    if(statusEl){statusEl.className='feedback ok';statusEl.textContent='✅ 최고 기록이 랭킹에 반영되었습니다.';}
    return true;
  }catch(e){
    if(statusEl){statusEl.className='feedback no';statusEl.textContent='랭킹 저장 실패: '+e.message;}
    return false;
  }
}