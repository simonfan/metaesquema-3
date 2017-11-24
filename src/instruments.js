const Tone = require('tone')

exports.conga = new Tone.MembraneSynth({
	'pitchDecay': 0.008,
	'octaves': 2,
	'envelope': {
		'attack': 0.0006,
		'decay': 0.5,
		'sustain': 0
	}
})
.toMaster()

exports.chord = new Tone.PluckSynth({
	attackNoise: 2,
	dampening: 4000,
	resonance: 0.95
})
.toMaster()

exports.chords = [
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 0.95
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.05
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.15
	},
	{
		attackNoise: 1,
		dampening: 4000,
		resonance: 1.25
	},
]
.map(options => {
	return new Tone.PluckSynth(options).toMaster()
})
