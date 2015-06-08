var ascc = angular.module('ascc', ['mgcrea.ngStrap', 'ngNumeraljs']);

ascc.controller('CtrlCalculator', function($scope) {
	$scope.namespace = {
		blockSize: 128,
	};
	$scope.sets = [];
	$scope.addExamples = function() {
		var s1 = newSet();
		s1.name = "mySet";
		s1.addBin();
		s1.bins[0].name="myNumber";
		s1.addBin();
		s1.bins[1].name="smallData"
		s1.bins[1].type='strblob';
		s1.bins[1].sizeText='16';
		s1.bins[1].sizeUpdate();
		$scope.sets.push(s1);

		var s2 = newSet();
		s2.name = "largeSet";
		s2.addBin();
		s2.bins[0].name="firstNumber";
		s2.addBin();
		s2.bins[1].name="largeData"
		s2.bins[1].type='strblob';
		s2.bins[1].sizeText='1.2k';
		s2.bins[1].sizeUpdate();
		s2.addBin();
		s2.bins[2].name="SecondNumber";
		s2.numRecordsText = '1.2b';
		s2.numRecordsUpdate();
		$scope.sets.push(s2);
	}
	$scope.addSet = function() {
		$scope.sets.push(newSet());
	};
	$scope.deleteSet = function(i) {
		$scope.sets.splice(i, 1);
	};

	function newSet() {
		var set = {
			name: '',
			bins: [],
			numRecordsText: '1.42m',
		};
		set.addBin = function() {
			set.bins.push(newBin());
		};
		set.deleteBin = function(binIndex) {
			set.bins.splice(binIndex, 1);
		};
		set.nameSize = function() {
			var ns = 0;
			if(set.name.length>0) {
				ns += 9 + set.name.length;
			}
			return ns;
		}
		set.binsSize = function() {
			var bs = 0;
			set.bins.forEach(function(bin) {
				bs += 28;
				if(bin.type=='integer') {
					bs += 2 + 8;
				} else {
					bs += 5 + bin.size;
				}
			});
			return bs;
		};
		set.recordSize = function() {
			var rs = 64;
			rs += set.nameSize();
			rs += set.binsSize();
			return rs;
		};
		set.recordSizeOnDisk = function() {
			var rs = set.recordSize();
			rs = Math.ceil(rs/$scope.namespace.blockSize)*$scope.namespace.blockSize;
			return rs;
		}
		set.numRecordsUpdate = function() {
			set.numRecords = numeral().unformat(set.numRecordsText);
		};
		set.numRecordsUpdate();
		return set;
	}

	function newBin() {
		var b = {
			name: '',
			type: 'integer',
			sizeText: '10',
		};
		b.sizeUpdate = function() {
			b.size = numeral().unformat(b.sizeText);
		};
		b.sizeUpdate();
		return b;
	}
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
