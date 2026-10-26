/* Shared opening artwork: the arcade monitor and the game's start screen. */
window.NightShiftTitle = {
  draw(ctx, width, height) {
    ctx.save();ctx.scale(width/960,height/640);
    const sky=ctx.createLinearGradient(0,0,0,640);sky.addColorStop(0,'#081726');sky.addColorStop(1,'#183d3c');ctx.fillStyle=sky;ctx.fillRect(0,0,960,640);
    for(let i=0;i<65;i++){ctx.fillStyle=i%3?'#9ab9aa':'#ffe6a8';ctx.fillRect((i*137+31)%960,(i*59+23)%330,2,2)}
    ctx.fillStyle='#8cc5aa';ctx.beginPath();ctx.arc(755,123,58,0,Math.PI*2);ctx.fill();ctx.fillStyle='#102837';ctx.beginPath();ctx.arc(776,103,56,0,Math.PI*2);ctx.fill();
    for(let i=0;i<15;i++){let x=i*70-10,h=70+(i*59)%140;ctx.fillStyle=i%2?'#142931':'#203a3e';ctx.fillRect(x,450-h,64,h);for(let y=465-h;y<440;y+=25)for(let n=0;n<3;n++){ctx.fillStyle=(i+n+y)%3?'#b3a66c':'#2e5251';ctx.fillRect(x+10+n*17,y,7,9)}}
    ctx.textAlign='center';ctx.fillStyle='#a4c9b7';ctx.font='20px sans-serif';ctx.fillText('THE REGULARS  /  A PARANORMAL SIDE JOB',480,64);
    ctx.shadowColor='#72eba2';ctx.shadowBlur=24;ctx.fillStyle='#c1ffce';ctx.font='bold 104px sans-serif';ctx.fillText('NIGHT SHIFT',480,240);ctx.shadowBlur=0;
    ctx.fillStyle='#efdfac';ctx.font='23px sans-serif';ctx.fillText('FIND THE GHOSTS. KEEP THE BUSINESS ALIVE.',480,283);
    // A friendly specter hovering between the capture beams.
    ctx.fillStyle='#c1ffce';ctx.beginPath();ctx.arc(480,360,43,Math.PI,0);ctx.lineTo(523,414);ctx.lineTo(502,400);ctx.lineTo(480,418);ctx.lineTo(458,400);ctx.lineTo(437,414);ctx.closePath();ctx.fill();
    ctx.fillStyle='#13343b';for(const x of [465,495]){ctx.beginPath();ctx.ellipse(x,361,6,10,0,0,7);ctx.fill()}
    for(const [x,col]of [[225,'#ffca84'],[735,'#83d8ef']]){ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,459);ctx.lineTo((x+480)/2,408);ctx.lineTo(480,391);ctx.stroke();ctx.fillStyle='#d6c6a6';ctx.fillRect(x-13,445,26,41);ctx.fillStyle='#10242b';ctx.fillRect(x-20,450,9,29);ctx.fillStyle='#ebd5ac';ctx.beginPath();ctx.arc(x,434,12,0,7);ctx.fill()}
    ctx.fillStyle='#203639';ctx.fillRect(0,491,960,149);ctx.fillStyle='#a7ebbc';ctx.fillRect(185,511,590,2);ctx.font='bold 32px sans-serif';ctx.fillText('PRESS START',480,561);ctx.fillStyle='#adc5b8';ctx.font='18px sans-serif';ctx.fillText('DRIVE  ·  EXPLORE  ·  CAPTURE  ·  UPGRADE',480,603);
    ctx.fillStyle='#08142233';for(let y=0;y<640;y+=4)ctx.fillRect(0,y,960,1);ctx.restore();
  }
};
