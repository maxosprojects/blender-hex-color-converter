(function ($) {

  const REG_VALID = /^[a-f0-9]*$/i;
  const REG_SPLIT = /.{1,2}/g;
  const GAMMA = 2.4;
  const GAMMA_CORRECTION = 1 / GAMMA;
  const CONVERTION_MAP = {
    'hex': linearToSrgb,
    'blender-hex': srgbToLinear
  };
  const XREF = {
    'hex': 'blender-hex',
    'blender-hex': 'hex'
  };

  $(function () {

    $('input[type=text]').on('input', change);
    $('a.btn-small').click(copy);

  }); // end of document ready

  // Converts linear HEX value (regular HEX) to sRGB (Gamma Corrected)
  function linearToSrgb(linearHex) {
    let num = parseInt(linearHex, 16);
    let linear = num / 255;
    if (linear <= 0.0031308) {
      return 12.92 * linear;
    }
    let srgb = (1.055 * Math.pow(num / 255, GAMMA_CORRECTION) - 0.055) * 255;
    srgb = Math.min(255, Math.max(0, srgb));
    return Math.round(srgb).toString(16);
  }

  // Converts sRGB HEX value (Gamma Corrected) to linear HEX (regular HEX)
  function srgbToLinear(srgbHex) {
    let num = parseInt(srgbHex, 16);
    let srgb = num / 255;
    if (srgb <= 0.04045) {
      return srgb / 12.92;
    }
    let linear = Math.pow((srgb + 0.055) / 1.055, GAMMA) * 255;
    linear = Math.min(255, Math.max(0, linear));
    return Math.round(linear).toString(16);
  }

  function split(input) {
    return input.match(REG_SPLIT);
  }

  function convert(id, value) {
    let parts = split(value);
    let res = parts.map(CONVERTION_MAP[id]).join('').toUpperCase();
    $('#' + XREF[id]).val(res);
    valid($('#' + XREF[id])[0], true);
  }

  function copy(evt) {
    evt.preventDefault();
    let id = '#' + $(evt.currentTarget).data('id');
    let input = $(id);
    input.focus();
    input.select();
    document.execCommand('copy');
    M.toast({
      html: 'Copied!',
      displayLength: 2000
    })
  }

  function change(evt) {
    evt.preventDefault();
    let field = evt.target.id;
    let value = $(evt.target).val();
    let isValid = REG_VALID.test(value);
    let sizeValid = value.length === 6;
    if (isValid) {
      if (sizeValid) {
        valid(evt.target, true);
        setStatus(evt.target, `${value.length}/6`);
        convert(evt.target.id, value);
      } else {
        valid(evt.target, false);
        setStatus(evt.target, `${value.length}/6`);
      }
    } else {
      valid(evt.target, false);
      setStatus(evt.target, 'invalid color');
    }
  }

  function setStatus(el, status) {
    let id = '#' + el.id + '-helper';
    $(id).attr('data-error', status);
  }

  function valid(el, isValid) {
    if (isValid) {
      $(el).removeClass('invalid');
      $(el).addClass('valid');
    } else {
      $(el).removeClass('valid');
      $(el).addClass('invalid');
    }
  }

})(jQuery); // end of jQuery name space
