var ascc = angular.module('ascc', ['mgcrea.ngStrap', 'ngNumeraljs']);

ascc.controller('CtrlCalculator', function($scope) {
	$scope.namespace = {
		storage: 'device',
		blockSize: 128,
		dataInMemory: false,
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
	$scope.totalNumRecords = function() {
		var nr = 0;
		$scope.sets.forEach(function(set) {
			nr += set.numRecords;
		});
		return nr;
	}
	$scope.totalRecordDeviceSize = function() {
		var s = 0;
		$scope.sets.forEach(function(set) {
			s += set.recordDeviceSize()*set.numRecords;
		});
		return s;
	};
	$scope.totalRecordDeviceSizeOnDisk = function() {
		var s = 0;
		$scope.sets.forEach(function(set) {
			s += set.recordDeviceSizeOnDisk()*set.numRecords;
		});
		return s;
	};
	$scope.totalRecordMemorySize = function() {
		var ms = 0;
		$scope.sets.forEach(function(set) {
			ms += set.numRecords*set.recordMemorySize();
		});
		return ms;
	}

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
		set.binsDeviceSize = function() {
			var bs = 0;
			set.bins.forEach(function(bin) {
				bs += calcBinDeviceSize(bin);
			});
			return bs;
		};
		set.binsMemorySize = function() {
			var bs = 0;
			set.bins.forEach(function(bin) {
				bs += calcBinMemorySize(bin);
			});
			return bs;
		};
		set.recordDeviceSize = function() {
			var rs = 64;
			rs += set.nameSize();
			rs += set.binsDeviceSize();
			return rs;
		};
		set.recordMemorySize = function() {
			var rs = 2;
			rs += set.binsMemorySize();
			return rs;
		};
		set.recordDeviceSizeOnDisk = function() {
			var rs = set.recordDeviceSize();
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
			secondaryIndex: false,
		};
		b.sizeUpdate = function() {
			b.size = numeral().unformat(b.sizeText);
		};
		b.sizeUpdate();
		return b;
	}

	function calcBinDeviceSize(bin) {
		var bs = 28; // general overhead
		if(bin.type=='integer') {
			bs += 2 + 8; // integer overhead + data size (64-bit)
		} else {
			bs += 5 + bin.size;
		}
		return bs;
	}
	function calcBinMemorySize(bin) {
		var bs = 12; // general overhead
		if(bin.type=='integer') {
			// integer data completely stored in bin general overhead
		} else {
			bs += 5 + bin.size;
		}
		return bs;
	}
});
