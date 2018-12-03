// let input = "fd 60 rt 120 fd 60 rt 120 fd 60 rt 120";
// let input = "repeat 3 [fd 60 rt 120]";
let input = "pu lt 90 fd 100 lt 90 fd 100 rt 180 pd repeat 3 [fd 40 pu fd 40 pd fd 40 rt 120]"
let tokens = [];
let turtle;

class Turtle {
	constructor(x, y, theta) {
		this.x = x;
		this.y = y;
		this.theta = theta;
		this.pen = true;

		this.commands = {
			'fd': function (tokenList, tokenIdx) {
				if (tokenIdx + 1 < tokenList.length) {
					let amt = trimBrackets(tokenList[++tokenIdx]);
					if (!isNaN(amt)) {
						turtle.forward(amt);
					} else throw '"' + amt + '" is not a number';
				} else throw '"' + tokenList[tokenIdx] + '" must be followed with an amount';
				return tokenIdx;
			},
			'bk': function (tokenList, tokenIdx) {
				if (tokenIdx + 1 < tokenList.length) {
					let amt = trimBrackets(tokenList[++tokenIdx]);
					if (!isNaN(amt)) {
						turtle.forward(-amt);
					} else throw '"' + amt + '" is not a number';
				} else throw '"' + tokenList[tokenIdx] + '" must be followed with an amount';
				return tokenIdx;
			},
			'rt': function (tokenList, tokenIdx) {
				if (tokenIdx + 1 < tokenList.length) {
					let amt = trimBrackets(tokenList[++tokenIdx]);
					if (!isNaN(amt)) {
						turtle.right(amt);
					} else throw '"' + amt + '" is not a number';
				} else throw '"' + tokenList[tokenIdx] + '" must be followed with an amount';
				return tokenIdx;
			},
			'lt': function (tokenList, tokenIdx) {
				if (tokenIdx + 1 < tokenList.length) {
					let amt = trimBrackets(tokenList[++tokenIdx]);
					if (!isNaN(amt)) {
						turtle.right(-amt);
					} else throw '"' + amt + '" is not a number';
				} else throw '"' + tokenList[tokenIdx] + '" must be followed with an amount';
				return tokenIdx;
			},
			'repeat': function (tokenList, tokenIdx) {
				let tokenIdxAtEnd = tokenIdx;
				if (tokenIdx + 1 < tokenList.length) {
					let amt = tokenList[++tokenIdx];
					if (!isNaN(amt)) {
						let toRepeat = [];

						if (tokenIdx + 1 < tokenList.length) {
							if (tokenList[tokenIdx + 1].includes('[')) {
								toRepeat.push(tokenList[++tokenIdx].substr(1));
								while (!tokenList[++tokenIdx].includes([']'])) {
									if (tokenIdx + 1 < tokenList.length) {
										toRepeat.push(tokenList[tokenIdx]);
									} else throw "'repeat' needs an ending bracket";
								}
								toRepeat.push(tokenList[tokenIdx].substr(0, tokenList[tokenIdx].lastIndexOf(']')));
								tokenIdxAtEnd = tokenIdx;
							} else throw "'repeat' needs a starting bracket";
						} else throw "'repeat' needs command(s) to repeat";

						// console.table(toRepeat);
						for (let i = 0; i < amt; i++) {
							let j = 0;
							while (j < toRepeat.length) {
								j = turtle.commands[trimBrackets(toRepeat[j])](toRepeat, j);
								j++;
							}
						}
					} else throw '"' + amt + '" is not a number';
				} else throw '"' + tokenList[tokenIdx] + '" must be followed with an amount';
				return tokenIdxAtEnd;
			},
			'pu': function(tokenList, tokenIdx) {
				turtle.pen = false;
				return tokenIdx;
			},
			'pd': function(tokenList, tokenIdx) {
				turtle.pen = true;
				return tokenIdx;
			}
		}
	}

	forward(n) {
		n = parseInt(n);

		if (this.pen) {
			stroke(255);
			strokeWeight(2)
			line(0, 0, n, 0);
		}
		translate(n, 0);
	}

	right(theta) {
		theta = parseInt(theta);

		rotate(theta);
	}

	draw() {
		translate(this.x, this.y);
		rotate(this.theta);
		try {
			let i = 0;
			while (i < tokens.length) {
				let token = tokens[i];
				i = this.commands[token](tokens, i);
				i++;
			}
		} catch (err) {
			console.log(err);
		}
	}
}

function trimBrackets(str) {
	return str.replace(/^([\[\]]*)/g, '').replace(/([\[\]]*)$/g, '');
}

function getTokens() {
	input = $('#commandinput').val();
	tokens = input.trim().split(/\s+/);
}

function clearInput() {
	input = "";
	tokens = [];
	$('#commandinput').val("");
}

function setup() {
	createCanvas(500, 500);
	angleMode(DEGREES);

	$("#commandinput").val(input);
	$("#commandinput").focusout(update);

	$('#clearinput').click(clearInput);

	turtle = new Turtle(250, 250, 0);
	update();
}

function update()
{
	background(0);
	getTokens();
	turtle.draw();
}

function draw() {
	// noLoop();
	
}