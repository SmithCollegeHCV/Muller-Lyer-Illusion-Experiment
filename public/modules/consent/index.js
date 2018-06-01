(function() {
  var data    = {}
    , workers = null;

  init();

  function init() {
    experimentr.hideNext();

    // load previous workers file
    d3.json('modules/consent/blocked-workers.json', function(err, d) {
      workers = d;
      d3.select('#workerId').attr('disabled', null);
    });

    d3.selectAll('#workerId')
      .on('keypress', function() { data.workerId = this.value; })
      .on('blur', function() { data.workerId = this.value; });

    d3.select('#consentYes').on('click', experimentr.next);

    d3.select('#checkId').on('click', validate);
  }

  function validate() {
    if( data.workerId ) {
      data.pageId = "consent";
      experimentr.addData(data);
      //experimentr.addData();
      experimentr.release();
      
      if( workers.indexOf(data.workerId) == -1 ) {
        d3.select('#consentYes').attr('disabled', null);
        d3.select('#validMessage').style('display', 'inline');
        d3.select('#invalidMessage').style('display', 'none');
      } else {
        d3.select('#invalidMessage').style('display', 'inline');
        d3.select('#validMessage').style('display', 'none');
        d3.select('#consentYes').attr('disabled', true);
      }
    }
  }

}());

