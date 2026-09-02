import fs from 'node:fs';
import path from 'node:path';

const basePath = 'c:/Users/riyat/OneDrive/Pictures/New folder/bday_ar';
const htmlPath = path.join(basePath, 'public/landing-pages/meng-to-sketchbook.html');

let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Replacements for user requests
html = html.replace(/Meng To/g, 'AaRiyan');
html = html.replace(/MengTo/g, 'AaRiyan');
html = html.replace(/<p class="hero-kicker">.*?<\/p>/, '');
html = html.replace(/<div class="top-socials">[\s\S]*?<\/div>/, '');

const newAbout = `
<section id="about" class="about">
    <p class="section-label">About</p>
    <p class="bio">AaRiyan. A story of us, written across time and distance, surviving every storm and cherishing every moment. These pages hold memories, promises, and the quiet moments that tied us together. Here's to us, our madness, and every single page we have yet to write.</p>
</section>
`;
html = html.replace(/<section id="about" class="about">[\s\S]*?<\/section>/, newAbout);

// 2. Fix the animation to stop at cover (LAND=0) and change M to let so we can populate it asynchronously
html = html.replace(/const M=PAGES\.length, LAND=6;/, 'let M=0, LAND=0;');

// 3. Fix TOC to skip hidden chapters and add data-idx
const tocOriginal = /PAGES\.forEach\(\(p,i\)=>\{\s*const li=document\.createElement\('li'\);\s*const b=document\.createElement\('button'\);\s*b\.className='plate';/m;
html = html.replace(tocOriginal, "PAGES.forEach((p,i)=>{ if(p.hideFromToc) return; const li=document.createElement('li'); const b=document.createElement('button'); b.className='plate'; b.dataset.idx=i;");

// Fix marks() to use dataset.idx
const marksOriginal = /plateList\.querySelectorAll\('\.plate'\)\.forEach\(\(b,i\)=>b\.setAttribute\('aria-current',i===cur\?'true':'false'\)\);/m;
html = html.replace(marksOriginal, "plateList.querySelectorAll('.plate').forEach(b=>b.setAttribute('aria-current',b.dataset.idx===String(cur)?'true':'false'));");

// 4. Update the pages logic
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  let scriptBody = scriptMatch[1];
  
  const oldPagesRegex = /const PAGES=\[\s*\{[^\}]+\},[\s\S]*?\];\s*PAGES\.forEach\(p=>p\.url=DIR\+p\.file\);/m;
  const customPagesCode = `
  const customChapters = [
    {
      isCover: true,
      hideFromToc: true,
      title: '',
      content: ''
    },
    {
      title: 'Chapter 1: Another Page of Us',
      content: 'Hey... yet another year of us being together. It’s been a hell of a ride, hasn’t it?\\n\\nLooking back at everything we’ve survived, I honestly find it hard to believe how far we’ve come. Starting all the way from "Netflix and chill" to "no Netflix, no chill, only chillam-chilli “—we really went through it all. But whatever happened, I’m so proud it played out the way it did, because somehow, every storm just ended up tying us tighter together.\\n\\nRemember the very last line of the last book I wrote for you?\\n\\n"More pages of us are yet to be written..."\\n\\nSo here we go, my love. Page one of our next chapter……'
    },
    {
      title: 'Chapter 2: September: Waves of Change',
      content: 'September rolled in with our college graduation ceremony. You weren’t there to witness it with me (and deep down, I guess I understand the reasons why you stayed away), but God, I missed you so much in that crowd.\\n\\nEverything around me was shifting at top speed—a brand new college, a whole new environment, new faces, freshers\\' parties, and endless noise. yet amidst all the chaos, we somehow managed to fight a little less that month. Definite progress! Mark that down on the calendar, because a peaceful September with us only happens once in a blue moon.'
    },
    {
      title: 'Chapter 3: October: High Drama & The Fall',
      content: 'Oh, October... what a absolute thriller you were.\\n\\nBetween the madness and excitement of your didi’s wedding, the drama was peak. But then came the end of October, bringing our major breakup. That period was a complete emotional blur (I was a total mess), going through a relentless loop of crying, overthinking, and feeling lost.\\n\\nAnd then... boom. Out of nowhere, you decided to meet me again.\\n\\nThings went right back to being us , spontaneous, intense, and a little chaotic. (Though we’ll conveniently skip the part where I threw up for the first time in my life, while wearing a white shirt of all things... absolute craziness, please spare me!).'
    },
    {
      title: 'Chapter 4: November - January: Finding Our Way Back',
      content: 'November bought yet another classic jhagda, but we didn\\'t let it keep us apart for long. By December and January, we made a conscious choice to bounce back. We went on as many dates as we could possibly squeeze in, soaking up each other\\'s presence and laughing over coffee or ramen (to be precise) in bean cafe  & repairing the cracks one date at a time.'
    },
    {
      title: 'Chapter 5: February: The Dream in Goa',
      content: 'Ah, February—the month carved permanently into my heart.\\n\\nFrom losing our minds at the Pillai’s DJ night to packing our bags for GOA... those memories are staying with me forever.\\n\\nOur first night there? Hehehehe, let’s keep that our little secret. But honestly, if you told the younger version of me that I would be spending Valentine’s Day in Goa’s hottest club, wrapped in a bold red dress, looking across the room at my valentine? …I wouldn’t have believed you. It was a literal dream-come-true moment.'
    },
    {
      title: 'Chapter 6: March to May: Highs, Lows & Match Day Wins',
      content: 'March: My birthday. You made it the absolute best day of my year, making me feel so incredibly cherished.\\n\\nApril: A mix of sweet dates, temper tantrums, and classic jhagde.\\n\\nMay: Oh, the IPL match ticket saga! I literally fought so hard to get those tickets for you, only to turn around and have to convince you to actually come with me (like wth!). But hey, as the saying goes—all’s well that ends well. We won!'
    },
    {
      title: 'Chapter 7: The Toughest Phase & My Promise to You',
      content: 'I don’t want to gloss over the hard parts. These last three months have been some of the toughest we have ever faced. I know I have showered you with endless tantrums, overreacted, and tested your patience. I know I can be a handful, but honestly... where else would I go to show all my unfiltered sides if not to you?\\n\\nI am truly, deeply sorry for the moments I hurt you or made things harder than they needed to be. I am working on myself, and I promise to do better (yaar, insaan hu, seekh rahi hu!).\\n\\nThank you for giving me this chance to prove my love. Thank you for believing in us even when things get heavy. I won\\'t disappoint you. Here’s to us, our madness, and every single page we have yet to write…..'
    },
    {
      title: 'Chapter 8: Forever & Beyond: The Pages We Have Yet to Write',
      content: 'If someone had told me years ago, back when we were just orbiting each other in the same room, laughing at the same jokes, completely unaware of what destiny was building , that I would end up holding the love of my life in my arms, I would have smiled. But I would have never guessed how deeply, painfully, and beautifully you would change me.\\n\\nWe didn’t have a smooth journey. We had storms. We had silence that hurt, distance that tested us, and moments where the world felt like it was tearing us apart. But every single time we broke, we found our way back. We showed up. We fought, not against each other, but for US. We proved that our love isn\\'t just a sudden feeling or a passing phase; it’s a choice we make every single day.'
    },
    {
      hideFromToc: true,
      title: '',
      content: 'And looking at you now, I know with absolute certainty: I choose you. In this lifetime, and in every single one after.'
    },
    {
      title: 'Chapter 9: I Promise Our Future...',
      content: 'I don\\'t just dream of a quiet life with you—I dream of a whole world built by our hands, brick by brick.\\n\\nI promise to grow old with you, gently. I want to witness every grey hair, every soft wrinkle, and every shift in your smile as the years roll by. I want to look at you when we’re old and fragile, and still see the exact same boy who made my world freeze with just one look.\\n\\nI promise to hold your hand through the next chapters. Through every new career, every move, every loss, and every victory. When the world gets too heavy or chaotic, I promise to be your calm, your safe harbor, and your quiet place to land.'
    },
    {
      hideFromToc: true,
      title: '',
      content: 'I promise to keep choosing us through the hard days. We’ve already survived the heartbreaks and the distance. So when life gets hard again~ because it will~ I promise to sit down with you, listen, compromise, and build right over the cracks, just like we always do.\\n\\nI promise to tell our story to our kids. I want to sit them down one day and tell them about how their parents orbited each other for three years, how a random horror movie changed everything, and how, no matter how many times life tried to pull us apart, the universe always dragged us right back home.'
    },
    {
      title: 'Chapter 10: To the End of Time……..',
      content: 'People spend their whole lives searching for the kind of love that feels like home, the kind of love that even the oceans would be jealous of. I don\\'t have to search anymore. I found it in your eyes.\\n\\nThank you for not giving up on me. Thank you for giving us a chance to grow, to heal, and to love harder than before. One lifetime will never be enough to love you the way you deserve, but I promise to spend every second I’m given making sure you feel adored, wanted, and cherished.\\n\\nNo matter where life takes us, no matter how many years pass... my heart will never belong anywhere else, but with YOU.\\n\\nForever yours,\\n.AaRiyan.'
    }
  ];

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\\n');
    let currentY = y;
    for (let p = 0; p < paragraphs.length; p++) {
      if (paragraphs[p].trim() === '') {
        currentY += lineHeight;
        continue;
      }
      const words = paragraphs[p].split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
  }

  function generatePageImageAsync(chapter) {
    return new Promise((resolve) => {
      // Small timeout to allow the browser thread to breathe (non-blocking)
      setTimeout(async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1760;
        canvas.height = 1240;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        ctx.clearRect(0, 0, 1760, 1240);

        if (chapter.isCover) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(880, 0, 880, 1240, { upperRight: 56, lowerRight: 56, upperLeft: 0, lowerLeft: 0 });
          ctx.clip();
          
          // Soft pastel pink/blush gradient
          const grad = ctx.createLinearGradient(880, 0, 1760, 1240);
          grad.addColorStop(0, '#FFF5F5'); // Soft blush
          grad.addColorStop(1, '#F3E1E1'); // Deeper pastel rose
          ctx.fillStyle = grad;
          ctx.fillRect(880, 0, 880, 1240);
          
          // Dusty rose double border
          ctx.strokeStyle = 'rgba(210, 166, 166, 0.8)';
          ctx.lineWidth = 6;
          ctx.strokeRect(930, 50, 780, 1140);
          ctx.lineWidth = 1.5;
          ctx.strokeRect(944, 64, 752, 1112);

          // Draw botanical leaf element asynchronously
          try {
            const img = new Image();
            img.src = 'meng-to-sketchbook/botany-left.png';
            await new Promise((r, reject) => { 
              img.onload = r; 
              img.onerror = reject;
            });
            ctx.globalAlpha = 0.5;
            const imgWidth = 450;
            const imgHeight = (img.height / img.width) * imgWidth;
            ctx.drawImage(img, 1320 - imgWidth/2, 750, imgWidth, imgHeight);
            ctx.globalAlpha = 1.0;
          } catch(e) {}
          
          // Deep mauve title
          ctx.fillStyle = '#5A4648'; 
          ctx.font = 'italic 160px "Instrument Serif", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AaRiyan', 1320, 480);
          
          ctx.font = '40px "Newsreader", serif';
          ctx.fillText('A Story of Us', 1320, 640);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.roundRect(0, 0, 1760, 1240, 56);
          ctx.clip();
          ctx.fillStyle = '#ece7dc';
          ctx.fillRect(0, 0, 1760, 1240);
          const gradient = ctx.createLinearGradient(0, 0, 1760, 0);
          gradient.addColorStop(0, 'rgba(0,0,0,0.01)');
          gradient.addColorStop(0.48, 'rgba(0,0,0,0)');
          gradient.addColorStop(0.5, 'rgba(0,0,0,0.12)'); 
          gradient.addColorStop(0.52, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, 'rgba(0,0,0,0.01)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1760, 1240);
          ctx.strokeStyle = 'rgba(43,39,33,0.05)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(880, 0);
          ctx.lineTo(880, 1240);
          ctx.stroke();

          if (chapter.title) {
            ctx.fillStyle = '#2b2721';
            ctx.font = 'italic 76px "Instrument Serif", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const titleWords = chapter.title.split(' ');
            let titleLine = '';
            let titleLines = [];
            for (let n = 0; n < titleWords.length; n++) {
              const testLine = titleLine + titleWords[n] + ' ';
              const metrics = ctx.measureText(testLine);
              if (metrics.width > 600 && n > 0) {
                titleLines.push(titleLine);
                titleLine = titleWords[n] + ' ';
              } else {
                titleLine = testLine;
              }
            }
            titleLines.push(titleLine);
            let titleY = 620 - ((titleLines.length * 90) / 2);
            for (let i = 0; i < titleLines.length; i++) {
              ctx.fillText(titleLines[i], 440, titleY + (i * 90));
            }
          }
          
          ctx.fillStyle = '#2b2721';
          ctx.font = '32px "Newsreader", serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          wrapText(ctx, chapter.content, 980, 140, 660, 52);
        }

        // Generating a blob is async and very fast, non-blocking
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/png');
      }, 0);
    });
  }

  // Define PAGES empty initially
  let PAGES = [];
  `;
  
  // Inject custom pages logic
  scriptBody = customPagesCode + scriptBody.replace(oldPagesRegex, '');

  // Now rewrite boot() to populate PAGES asynchronously AFTER fonts load
  const bootOriginal = /\(async function boot\(\)\{\s*idx=Q\.has\('shot'\)\?\(parseInt\(Q\.get\('shot'\),10\)\|\|0\)%M:0;/m;
  const bootReplacement = `(async function boot(){
    if(document.fonts&&document.fonts.ready)await document.fonts.ready.catch(()=>{});
    
    // Generate pages without blocking the main thread (awaiting promises one by one or in Promise.all)
    const pagePromises = customChapters.map(async (chapter) => ({
      title: chapter.title || '',
      hideFromToc: !!chapter.hideFromToc,
      url: await generatePageImageAsync(chapter)
    }));
    
    PAGES = await Promise.all(pagePromises);
    
    // Set M and LAND
    M = PAGES.length;
    LAND = 0;
    
    // Repopulate TOC with the new pages
    const plateList = document.getElementById('plateList');
    plateList.innerHTML = '';
    PAGES.forEach((p,i)=>{
      if(p.hideFromToc) return;
      const li=document.createElement('li');
      const b=document.createElement('button');
      b.className='plate';
      b.dataset.idx=i;
      b.innerHTML='<span class="n">'+String(i+1).padStart(2,'0')+'</span>'+
                  '<span class="t"></span><span class="p"></span>';
      b.querySelector('.t').textContent=p.title;
      b.onclick=()=>{goTo(i);document.getElementById('sketchbook').scrollIntoView({behavior:'smooth',block:'center'});};
      li.appendChild(b);plateList.appendChild(li);
    });

    idx=Q.has('shot')?(parseInt(Q.get('shot'),10)||0)%M:0;
`;
  
  scriptBody = scriptBody.replace(bootOriginal, bootReplacement);

  html = html.replace(/<script>[\s\S]*?<\/script>/, `<script>\n${scriptBody}\n</script>`);
}

// Remove empty <a href="#contact"> if there are any left
html = html.replace(/<a href="#contact"[^>]*>.*?<\/a>/g, '');

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML successfully patched to v9 (pastel cover)!');
