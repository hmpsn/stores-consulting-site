import {test} from 'node:test';
import assert from 'node:assert/strict';
import {videoEmbed} from '../../src/lib/video-url.ts';
test('video blocks accept supported URLs and reject unsafe or incomplete embeds',()=>{
 assert.equal(videoEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
 assert.equal(videoEmbed('https://youtu.be/dQw4w9WgXcQ?t=10'),'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
 assert.equal(videoEmbed('https://vimeo.com/12345678'),'https://player.vimeo.com/video/12345678');
 for(const value of ['javascript:alert(1)','https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ','https://www.youtube.com/','http://vimeo.com/1234','https://example.com/video'])assert.equal(videoEmbed(value),undefined);
});
