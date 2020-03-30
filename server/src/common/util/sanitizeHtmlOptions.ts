// options for allowed tags in html posts
export default {
	allowedTags: ['h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
		'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
		'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img'],
	disallowedTagsMode: 'discard',
	allowedAttributes: {
		a: ['href', 'name', 'target'],
		img: ['src'],
	},
	// Lots of these won't come up by default because we don't allow them
	selfClosing: ['img', 'br', 'hr'],
	// URL schemes we permit
  allowedSchemes: ['http', 'https'],
  // since images are uploaded as Data URIs
	allowedSchemesByTag: {
		img: ['data'],
	},
	allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
	allowProtocolRelative: true,
};