**COMP 580 Spring 2020**  
**Final Report**  
**Mchael Sparks**  
**Project Name: Piano Pro**  

**Purpose, Description, and Intended Audience**  
This project is intended to help both blind and sighted people learn piano skills through the browser. Generally it can be time consuming, resource intensive, and expensive to get piano lessons and materials for the visually impared, so this project was made to help alleviate some of the costs and provide an alternative to learning beginner to intermediate piano skills. Piano Pro trains in 4 different skills: Perfect Pitch, Intervals, Chords, and Rhythm, all core skills pianists must have. 
- Perfect Pitch trains the user's ear by playing a note between C4 and C5 where they have 3 chances to guess the correct choice.
- Intervals trains the user's ear to pick up subtle differences between 2 notes. The Browser plays 2 notes, and the user decides if the 2 notes is the lower interval or the higher interval. 
- Chords trains the user to identify and play chords of 10 different types. A chord is played and the user must play all the required notes at the same time.
- Rhythm trains the user to keep a steady beat. The user is given 4 ‘freebie’ beats where they keep beat with the browser and then 10 additional beats where they must try to maintain the same beat. The closer the BPM the better.  
The traditional route to playing piano, that is through reading sheet music, is complicated in braille. Where expertise may be achieved through a sighted learner where they can play a written piece by ‘sight reading’, blind people unfortunately do not have this option. All of these skills in Piano Pro are useful to learning how to ‘play by ear’, an often preferred method of learning the piano by blind people. This app is meant to provide useful skills to any pianist wanting to practice music theory fundamentals for the purpose of learning songs by ear. 

**MIDI Device Setup**  
This app is MIDI device compatible! That is to say you can operate this app with the aid of an electric piano (this is the preferred way of using this app). Generally what one will need to do is find the manual or manufacturer’s site for the desired MIDI input device and download the correct driver so the page will recognize inputs. The specific process for each device is different, and drivers are often frustrating to install. The project is playable without a MIDI input device and instead using your keyboard, but it is difficult to do chord training without one.

**Frameworks, Libraries, and other Sources**  
Web MIDI API  
Featured Web MIDI API Examples  
MIDI.JS  
Web Audio API  
HTML5 speech synthesis  
Jquery  
bpm-game: (https://github.com/tgwizard/bpm-game/blob/gh-pages/js/keep-bpm.js)  
dom_request_script.js: Loads scripts in synchronously, or asynchronously.  
dom_request_xhr.js: Cross-browser XML/Http request.  
Kawai Grand Piano sf2 sounds  
Kingdom Hearts sounds  
Free Sound sounds  

**How-To Guide**  
This app requires Google Chrome to make full use of MIDI technology. From opening the webpage the sight should be navigable using the arrow keys and items can be chosen using enter. Please consult the How-To graphics, but generally the controls are:
Enter: Help
Space: Start/Stop/Reset Game
Arrow Up: Navigate up through options
Arrow Down: Navigate down through options
Arrow Left: No/Lower
Arrow Right: Yes/Higher
M: Score
AWSEDFTJIKOL;: Uses computer keyboard to play C4 through C5 (these are common notes)
GH: change octave

**Problems Encountered**  
- MIDI drivers are buggy, problems have been encountered with MIDI input devices on the GitPage site
- Input lag can be an issue depending on the environment
- Text to Speech can get queued too much and be confusing
- Clicking on the page is a necessary evil, and it may be a problem for some users
- Using the computer keyboard as an input device can be frustrating at times, competing ideologies exist on how the setup should be, my setup utilizes the common feature of ‘home nubs’ on ‘F’ and ‘J’ that could help orient blind users better. 

**Future Work**  
- Many more mini games could be imagined, such as scale training, basic song training, different time signature training. It would be great to see this project become a nexus for various fun piano games that could be assigned by instructors. 
- Very simple games such as identifying where a note on a keyboard could be very useful for teaching new young learners. This app assumes a fundamental understanding of the piano, but one could imagine that young blind learners would struggle with a haptic understanding of the piano without an instructor. 
- A very hard project would be making an accessible version of https://galactic.ink/piano/ that allows for blind people to learn piano completely by ear, perhaps even providing a learning path to basic piano competency. 



