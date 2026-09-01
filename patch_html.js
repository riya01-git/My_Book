import fs from 'node:fs';
import path from 'node:path';

const basePath = 'c:/Users/riyat/OneDrive/Pictures/New folder/bday_ar';
const htmlPath = path.join(basePath, 'public/landing-pages/meng-to-sketchbook.html');

const instrumentSerifItalic = fs.readFileSync(path.join(basePath, 'public/landing-pages/meng-to-sketchbook/instrument-serif-italic.woff2')).toString('base64');
const newsreader = fs.readFileSync(path.join(basePath, 'public/landing-pages/meng-to-sketchbook/newsreader.woff2')).toString('base64');

let html = fs.readFileSync(htmlPath, 'utf8');

const replacement = `
  const instrumentSerifItalicB64 = "${instrumentSerifItalic}";
  const newsreaderB64 = "${newsreader}";

  const customChapters = [
    {
      title: 'Chapter : Another Page of Us',
      content: 'Hey... yet another year of us being together. It’s been a hell of a ride, hasn’t it?<br/><br/>Looking back at everything we’ve survived, I honestly find it hard to believe how far we’ve come. Starting all the way from "Netflix and chill" to "no Netflix, no chill, only chillam-chilli “—we really went through it all. But whatever happened, I’m so proud it played out the way it did, because somehow, every storm just ended up tying us tighter together.<br/><br/>Remember the very last line of the last book I wrote for you?<br/><br/>"More pages of us are yet to be written..."<br/><br/>So here we go, my love. Page one of our next chapter……'
    },
    {
      title: 'Chapter : September: Waves of Change',
      content: 'September rolled in with our college graduation ceremony. You weren’t there to witness it with me (and deep down, I guess I understand the reasons why you stayed away), but God, I missed you so much in that crowd.<br/><br/>Everything around me was shifting at top speed—a brand new college, a whole new environment, new faces, freshers\\' parties, and endless noise. yet amidst all the chaos, we somehow managed to fight a little less that month. Definite progress! Mark that down on the calendar, because a peaceful September with us only happens once in a blue moon.'
    },
    {
      title: 'Chapter October: High Drama & The Fall',
      content: 'Oh, October... what a absolute thriller you were.<br/><br/>Between the madness and excitement of your didi’s wedding, the drama was peak. But then came the end of October, bringing our major breakup. That period was a complete emotional blur (I was a total mess), going through a relentless loop of crying, overthinking, and feeling lost.<br/><br/>And then... boom. Out of nowhere, you decided to meet me again.<br/><br/>Things went right back to being us , spontaneous, intense, and a little chaotic. (Though we’ll conveniently skip the part where I threw up for the first time in my life, while wearing a white shirt of all things... absolute craziness, please spare me!).'
    },
    {
      title: 'Chapter November - January: Finding Our Way Back',
      content: 'November bought yet another classic jhagda, but we didn\\'t let it keep us apart for long. By December and January, we made a conscious choice to bounce back. We went on as many dates as we could possibly squeeze in, soaking up each other\\'s presence and laughing over coffee or ramen (to be precise) in bean cafe  & repairing the cracks one date at a time.'
    },
    {
      title: 'Chapter February: The Dream in Goa',
      content: 'Ah, February—the month carved permanently into my heart.<br/><br/>From losing our minds at the Pillai’s DJ night to packing our bags for GOA... those memories are staying with me forever.<br/><br/>Our first night there? Hehehehe, let’s keep that our little secret. But honestly, if you told the younger version of me that I would be spending Valentine’s Day in Goa’s hottest club, wrapped in a bold red dress, looking across the room at my valentine? …I wouldn’t have believed you. It was a literal dream-come-true moment.'
    },
    {
      title: 'Chapter March to May: Highs, Lows & Match Day Wins',
      content: 'March: My birthday. You made it the absolute best day of my year, making me feel so incredibly cherished.<br/><br/>April: A mix of sweet dates, temper tantrums, and classic jhagde.<br/><br/>May: Oh, the IPL match ticket saga! I literally fought so hard to get those tickets for you, only to turn around and have to convince you to actually come with me (like wth!). But hey, as the saying goes—all’s well that ends well. We won!'
    },
    {
      title: 'Chapter 7 : The Toughest Phase & My Promise to You',
      content: 'I don’t want to gloss over the hard parts. These last three months have been some of the toughest we have ever faced. I know I have showered you with endless tantrums, overreacted, and tested your patience. I know I can be a handful, but honestly... where else would I go to show all my unfiltered sides if not to you?<br/><br/>I am truly, deeply sorry for the moments I hurt you or made things harder than they needed to be. I am working on myself, and I promise to do better (yaar, insaan hu, seekh rahi hu!).<br/><br/>Thank you for giving me this chance to prove my love. Thank you for believing in us even when things get heavy. I won\\'t disappoint you. Here’s to us, our madness, and every single page we have yet to write…..'
    },
    {
      title: 'Chapter Forever & Beyond: The Pages We Have Yet to Write',
      content: 'If someone had told me years ago, back when we were just orbiting each other in the same room, laughing at the same jokes, completely unaware of what destiny was building , that I would end up holding the love of my life in my arms, I would have smiled. But I would have never guessed how deeply, painfully, and beautifully you would change me.<br/><br/>We didn’t have a smooth journey. We had storms. We had silence that hurt, distance that tested us, and moments where the world felt like it was tearing us apart. But every single time we broke, we found our way back. We showed up. We fought, not against each other, but for US. We proved that our love isn\\'t just a sudden feeling or a passing phase; it’s a choice we make every single day.<br/><br/>And looking at you now, I know with absolute certainty: I choose you. In this lifetime, and in every single one after.'
    },
    {
      title: 'Chapter 9 : I Promise Our Future...',
      content: 'I don\\'t just dream of a quiet life with you—I dream of a whole world built by our hands, brick by brick.<br/><br/>I promise to grow old with you, gently. I want to witness every grey hair, every soft wrinkle, and every shift in your smile as the years roll by. I want to look at you when we’re old and fragile, and still see the exact same boy who made my world freeze with just one look.<br/><br/>I promise to hold your hand through the next chapters. Through every new career, every move, every loss, and every victory. When the world gets too heavy or chaotic, I promise to be your calm, your safe harbor, and your quiet place to land.<br/><br/>I promise to keep choosing us through the hard days. We’ve already survived the heartbreaks and the distance. So when life gets hard again~ because it will~ I promise to sit down with you, listen, compromise, and build right over the cracks, just like we always do.<br/><br/>I promise to tell our story to our kids. I want to sit them down one day and tell them about how their parents orbited each other for three years, how a random horror movie changed everything, and how, no matter how many times life tried to pull us apart, the universe always dragged us right back home.'
    },
    {
      title: 'Chapter 10 : To the End of Time……..',
      content: 'People spend their whole lives searching for the kind of love that feels like home, the kind of love that even the oceans would be jealous of. I don\\'t have to search anymore. I found it in your eyes.<br/><br/>Thank you for not giving up on me. Thank you for giving us a chance to grow, to heal, and to love harder than before. One lifetime will never be enough to love you the way you deserve, but I promise to spend every second I’m given making sure you feel adored, wanted, and cherished.<br/><br/>No matter where life takes us, no matter how many years pass... my heart will never belong anywhere else, but with YOU.<br/><br/>Forever yours,<br/>.AaRiyan.'
    }
  ];

  function renderChapterToDataURL(chapter) {
    const svgContent = \`
      <svg xmlns="http://www.w3.org/2000/svg" width="1760" height="1240">
        <style>
          @font-face {
            font-family: 'Instrument Serif';
            font-style: italic;
            font-weight: 400;
            src: url(data:font/woff2;base64,\${instrumentSerifItalicB64}) format('woff2');
          }
          @font-face {
            font-family: 'Newsreader';
            font-style: normal;
            font-weight: 400;
            src: url(data:font/woff2;base64,\${newsreaderB64}) format('woff2');
          }
        </style>
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width:1760px;height:1240px;display:flex;background:#ece7dc;font-family:'Newsreader',serif;color:#2b2721;">
            
            <!-- Left Page: Title -->
            <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:120px;box-sizing:border-box;border-right:1px solid rgba(43,39,33,0.1);">
              <h1 style="font-family:'Instrument Serif',serif;font-size:72px;font-style:italic;font-weight:400;text-align:center;line-height:1.2;margin:0;">
                \${chapter.title}
              </h1>
            </div>

            <!-- Right Page: Content -->
            <div style="flex:1;display:flex;align-items:center;padding:120px 80px 120px 120px;box-sizing:border-box;">
              <p style="font-size:32px;line-height:1.8;margin:0;font-weight:400;white-space:pre-wrap;">
                \${chapter.content.replace(/<br\\/><br\\/>/g, '\\n\\n')}
              </p>
            </div>

          </div>
        </foreignObject>
      </svg>\`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent.replace(/\\n/g, '').replace(/\\s+/g, ' '));
  }

  const PAGES = customChapters.map(chapter => ({
    title: chapter.title,
    url: renderChapterToDataURL(chapter)
  }));
`;

const regex = /const PAGES=\[\s*\{[^\}]+\},[^\]]+\];\s*PAGES\.forEach\(p=>p\.url=DIR\+p\.file\);/m;
if (!regex.test(html)) {
  console.log('Regex did not match!');
} else {
  html = html.replace(regex, replacement);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('HTML updated successfully.');
}
