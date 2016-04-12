// One of the easiest ways to get data from the backend in Jade to javascripts
// on the front-end is to wrap a <script> tag like so
// <script>
// var id = #{id};
// </script>
// Unfortunately, typescript doesn't like this because it doens't know that
// is going to be there. This takes cares of that issue.
var id;
