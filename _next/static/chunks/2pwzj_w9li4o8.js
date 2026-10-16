(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43971,e=>{"use strict";let t,n;var r=e.i(43476);function i(){return(i=Object.assign.bind()).apply(null,arguments)}var a=e.i(71645),o=e.i(90072),s=e.i(90874),l=o,c=o;let u=new c.VQ,d=new c.cE;class p extends c.Kx{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new c.ki([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new c.ki([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new c.hC(t,6,1);return this.setAttribute("instanceStart",new c.Zq(n,3,0)),this.setAttribute("instanceEnd",new c.Zq(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new c.hC(n,2*t,1);return this.setAttribute("instanceColorStart",new c.Zq(r,t,0)),this.setAttribute("instanceColorEnd",new c.Zq(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c.nw(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new c.VQ);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),u.setFromBufferAttribute(t),this.boundingBox.union(u))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new c.L0),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)d.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(d)),d.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(d));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=o,m=e.i(8560);let h=parseInt(o.Tu.replace(/\D+/g,""));class g extends f.Zg{constructor(e){super({type:"LineMaterial",uniforms:f.SP.clone(f.SP.merge([m.O.common,m.O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.wq(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${h>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let y=h>=125?"uv1":"uv2",v=new l.$i,b=new l.cE,x=new l.cE,w=new l.$i,E=new l.$i,S=new l.$i,M=new l.cE,A=new l.nd,C=new l._i,L=new l.cE,_=new l.VQ,T=new l.L0,R=new l.$i;function j(e,t,r){return R.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),R.multiplyScalar(1/R.w),R.x=n/r.width,R.y=n/r.height,R.applyMatrix4(e.projectionMatrixInverse),R.multiplyScalar(1/R.w),Math.abs(Math.max(R.x,R.y))}class P extends l.kE{constructor(e=new p,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)b.fromBufferAttribute(t,e),x.fromBufferAttribute(n,e),r[i]=0===i?0:r[i-1],r[i+1]=r[i]+b.distanceTo(x);let i=new l.hC(r,2,1);return e.setAttribute("instanceDistanceStart",new l.Zq(i,1,0)),e.setAttribute("instanceDistanceEnd",new l.Zq(i,1,1)),this}raycast(e,r){let i,a,o=this.material.worldUnits,s=e.camera;null!==s||o||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let u=this.matrixWorld,d=this.geometry,p=this.material;if(n=p.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),T.copy(d.boundingSphere).applyMatrix4(u),o)i=.5*n;else{let e=Math.max(s.near,T.distanceToPoint(t.origin));i=j(s,e,p.resolution)}if(T.radius+=i,!1!==t.intersectsSphere(T)){if(null===d.boundingBox&&d.computeBoundingBox(),_.copy(d.boundingBox).applyMatrix4(u),o)a=.5*n;else{let e=Math.max(s.near,_.distanceToPoint(t.origin));a=j(s,e,p.resolution)}_.expandByScalar(a),!1!==t.intersectsBox(_)&&(o?function(e,r){let i=e.matrixWorld,a=e.geometry,o=a.attributes.instanceStart,s=a.attributes.instanceEnd,c=Math.min(a.instanceCount,o.count);for(let a=0;a<c;a++){C.start.fromBufferAttribute(o,a),C.end.fromBufferAttribute(s,a),C.applyMatrix4(i);let c=new l.cE,u=new l.cE;t.distanceSqToSegment(C.start,C.end,u,c),u.distanceTo(c)<.5*n&&r.push({point:u,pointOnLine:c,distance:t.origin.distanceTo(u),object:e,face:null,faceIndex:a,uv:null,[y]:null})}}(this,r):function(e,r,i){let a=r.projectionMatrix,o=e.material.resolution,s=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,p=Math.min(c.instanceCount,u.count),f=-r.near;t.at(1,S),S.w=1,S.applyMatrix4(r.matrixWorldInverse),S.applyMatrix4(a),S.multiplyScalar(1/S.w),S.x*=o.x/2,S.y*=o.y/2,S.z=0,M.copy(S),A.multiplyMatrices(r.matrixWorldInverse,s);for(let r=0;r<p;r++){if(w.fromBufferAttribute(u,r),E.fromBufferAttribute(d,r),w.w=1,E.w=1,w.applyMatrix4(A),E.applyMatrix4(A),w.z>f&&E.z>f)continue;if(w.z>f){let e=w.z-E.z,t=(w.z-f)/e;w.lerp(E,t)}else if(E.z>f){let e=E.z-w.z,t=(E.z-f)/e;E.lerp(w,t)}w.applyMatrix4(a),E.applyMatrix4(a),w.multiplyScalar(1/w.w),E.multiplyScalar(1/E.w),w.x*=o.x/2,w.y*=o.y/2,E.x*=o.x/2,E.y*=o.y/2,C.start.copy(w),C.start.z=0,C.end.copy(E),C.end.z=0;let c=C.closestPointToPointParameter(M,!0);C.at(c,L);let p=l.rB.lerp(w.z,E.z,c),m=p>=-1&&p<=1,h=M.distanceTo(L)<.5*n;if(m&&h){C.start.fromBufferAttribute(u,r),C.end.fromBufferAttribute(d,r),C.start.applyMatrix4(s),C.end.applyMatrix4(s);let n=new l.cE,a=new l.cE;t.distanceSqToSegment(C.start,C.end,a,n),i.push({point:a,pointOnLine:n,distance:t.origin.distanceTo(a),object:e,face:null,faceIndex:r,uv:null,[y]:null})}}}(this,s,r))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class O extends p{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(3===t)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class B extends P{constructor(e=new O,t=new g({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let D=a.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:r,lineWidth:l,segments:c,dashed:u,...d},f){var m,h;let y=(0,s.f)(e=>e.size),v=a.useMemo(()=>c?new P:new B,[c]),[b]=a.useState(()=>new g),x=(null==n||null==(m=n[0])?void 0:m.length)===4?4:3,w=a.useMemo(()=>{let r=c?new p:new O,i=e.map(e=>{let t=Array.isArray(e);return e instanceof o.cE||e instanceof o.$i?[e.x,e.y,e.z]:e instanceof o.wq?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof o.Es?e.toArray():e);r.setColors(e.flat(),x)}return r},[e,c,n,x]);return a.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),a.useLayoutEffect(()=>{u?b.defines.USE_DASH="":delete b.defines.USE_DASH,b.needsUpdate=!0},[u,b]),a.useEffect(()=>()=>{w.dispose(),b.dispose()},[w]),a.createElement("primitive",i({object:v,ref:f},d),a.createElement("primitive",{object:w,attach:"geometry"}),a.createElement("primitive",i({object:b,attach:"material",color:t,vertexColors:!!n,resolution:[y.width,y.height],linewidth:null!=(h=null!=r?r:l)?h:1,dashed:u,transparent:4===x},d)))});var F=e.i(95393),z=Object.defineProperty;class G{constructor(){var e;let t,n;n=void 0,(t="symbol"!=typeof(e="_listeners")?e+"":e)in this?z(this,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):this[t]=n}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}}var U=Object.defineProperty,I=(e,t,n)=>{let r;return(r="symbol"!=typeof t?t+"":t)in e?U(e,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[r]=n,n};let N=new o.Wk,k=new o._m,H=Math.cos(Math.PI/180*70),V=(e,t)=>(e%t+t)%t;class q extends G{constructor(e,t){let n,r,i,a,s,l,c,u,d,p;super(),I(this,"object"),I(this,"domElement"),I(this,"enabled",!0),I(this,"target",new o.cE),I(this,"minDistance",0),I(this,"maxDistance",1/0),I(this,"minZoom",0),I(this,"maxZoom",1/0),I(this,"minPolarAngle",0),I(this,"maxPolarAngle",Math.PI),I(this,"minAzimuthAngle",-1/0),I(this,"maxAzimuthAngle",1/0),I(this,"enableDamping",!1),I(this,"dampingFactor",.05),I(this,"enableZoom",!0),I(this,"zoomSpeed",1),I(this,"enableRotate",!0),I(this,"rotateSpeed",1),I(this,"enablePan",!0),I(this,"panSpeed",1),I(this,"screenSpacePanning",!0),I(this,"keyPanSpeed",7),I(this,"zoomToCursor",!1),I(this,"autoRotate",!1),I(this,"autoRotateSpeed",2),I(this,"reverseOrbit",!1),I(this,"reverseHorizontalOrbit",!1),I(this,"reverseVerticalOrbit",!1),I(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),I(this,"mouseButtons",{LEFT:o.vN.ROTATE,MIDDLE:o.vN.DOLLY,RIGHT:o.vN.PAN}),I(this,"touches",{ONE:o._l.ROTATE,TWO:o._l.DOLLY_PAN}),I(this,"target0"),I(this,"position0"),I(this,"zoom0"),I(this,"_domElementKeyEvents",null),I(this,"getPolarAngle"),I(this,"getAzimuthalAngle"),I(this,"setPolarAngle"),I(this,"setAzimuthalAngle"),I(this,"getDistance"),I(this,"getZoomScale"),I(this,"listenToKeyEvents"),I(this,"stopListenToKeyEvents"),I(this,"saveState"),I(this,"reset"),I(this,"update"),I(this,"connect"),I(this,"dispose"),I(this,"dollyIn"),I(this,"dollyOut"),I(this,"getScale"),I(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>x.phi,this.getAzimuthalAngle=()=>x.theta,this.setPolarAngle=e=>{let t=V(e,2*Math.PI),n=x.phi;n<0&&(n+=2*Math.PI),t<0&&(t+=2*Math.PI);let r=Math.abs(t-n);2*Math.PI-r<r&&(t<n?t+=2*Math.PI:n+=2*Math.PI),w.phi=t-n,f.update()},this.setAzimuthalAngle=e=>{let t=V(e,2*Math.PI),n=x.theta;n<0&&(n+=2*Math.PI),t<0&&(t+=2*Math.PI);let r=Math.abs(t-n);2*Math.PI-r<r&&(t<n?t+=2*Math.PI:n+=2*Math.PI),w.theta=t-n,f.update()},this.getDistance=()=>f.object.position.distanceTo(f.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",eu),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",eu),this._domElementKeyEvents=null},this.saveState=()=>{f.target0.copy(f.target),f.position0.copy(f.object.position),f.zoom0=f.object.zoom},this.reset=()=>{f.target.copy(f.target0),f.object.position.copy(f.position0),f.object.zoom=f.zoom0,f.object.updateProjectionMatrix(),f.dispatchEvent(m),f.update(),v=y.NONE},this.update=(n=new o.cE,r=new o.cE(0,1,0),a=(i=new o.as().setFromUnitVectors(e.up,r)).clone().invert(),s=new o.cE,l=new o.as,c=2*Math.PI,function(){let t=f.object.position;i.setFromUnitVectors(e.up,r),a.copy(i).invert(),n.copy(t).sub(f.target),n.applyQuaternion(i),x.setFromVector3(n),f.autoRotate&&v===y.NONE&&U(2*Math.PI/60/60*f.autoRotateSpeed),f.enableDamping?(x.theta+=w.theta*f.dampingFactor,x.phi+=w.phi*f.dampingFactor):(x.theta+=w.theta,x.phi+=w.phi);let u=f.minAzimuthAngle,d=f.maxAzimuthAngle;isFinite(u)&&isFinite(d)&&(u<-Math.PI?u+=c:u>Math.PI&&(u-=c),d<-Math.PI?d+=c:d>Math.PI&&(d-=c),u<=d?x.theta=Math.max(u,Math.min(d,x.theta)):x.theta=x.theta>(u+d)/2?Math.max(u,x.theta):Math.min(d,x.theta)),x.phi=Math.max(f.minPolarAngle,Math.min(f.maxPolarAngle,x.phi)),x.makeSafe(),!0===f.enableDamping?f.target.addScaledVector(S,f.dampingFactor):f.target.add(S),f.zoomToCursor&&D||f.object.isOrthographicCamera?x.radius=$(x.radius):x.radius=$(x.radius*E),n.setFromSpherical(x),n.applyQuaternion(a),t.copy(f.target).add(n),f.object.matrixAutoUpdate||f.object.updateMatrix(),f.object.lookAt(f.target),!0===f.enableDamping?(w.theta*=1-f.dampingFactor,w.phi*=1-f.dampingFactor,S.multiplyScalar(1-f.dampingFactor)):(w.set(0,0,0),S.set(0,0,0));let p=!1;if(f.zoomToCursor&&D){let t=null;if(f.object instanceof o.zm&&f.object.isPerspectiveCamera){let e=n.length();t=$(e*E);let r=e-t;f.object.position.addScaledVector(O,r),f.object.updateMatrixWorld()}else if(f.object.isOrthographicCamera){let e=new o.cE(B.x,B.y,0);e.unproject(f.object),f.object.zoom=Math.max(f.minZoom,Math.min(f.maxZoom,f.object.zoom/E)),f.object.updateProjectionMatrix(),p=!0;let r=new o.cE(B.x,B.y,0);r.unproject(f.object),f.object.position.sub(r).add(e),f.object.updateMatrixWorld(),t=n.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),f.zoomToCursor=!1;null!==t&&(f.screenSpacePanning?f.target.set(0,0,-1).transformDirection(f.object.matrix).multiplyScalar(t).add(f.object.position):(N.origin.copy(f.object.position),N.direction.set(0,0,-1).transformDirection(f.object.matrix),Math.abs(f.object.up.dot(N.direction))<H?e.lookAt(f.target):(k.setFromNormalAndCoplanarPoint(f.object.up,f.target),N.intersectPlane(k,f.target))))}else f.object instanceof o.Sc&&f.object.isOrthographicCamera&&(p=1!==E)&&(f.object.zoom=Math.max(f.minZoom,Math.min(f.maxZoom,f.object.zoom/E)),f.object.updateProjectionMatrix());return E=1,D=!1,!!(p||s.distanceToSquared(f.object.position)>b||8*(1-l.dot(f.object.quaternion))>b)&&(f.dispatchEvent(m),s.copy(f.object.position),l.copy(f.object.quaternion),p=!1,!0)}),this.connect=e=>{f.domElement=e,f.domElement.style.touchAction="none",f.domElement.addEventListener("contextmenu",ed),f.domElement.addEventListener("pointerdown",eo),f.domElement.addEventListener("pointercancel",el),f.domElement.addEventListener("wheel",ec)},this.dispose=()=>{var e,t,n,r,i,a;f.domElement&&(f.domElement.style.touchAction="auto"),null==(e=f.domElement)||e.removeEventListener("contextmenu",ed),null==(t=f.domElement)||t.removeEventListener("pointerdown",eo),null==(n=f.domElement)||n.removeEventListener("pointercancel",el),null==(r=f.domElement)||r.removeEventListener("wheel",ec),null==(i=f.domElement)||i.ownerDocument.removeEventListener("pointermove",es),null==(a=f.domElement)||a.ownerDocument.removeEventListener("pointerup",el),null!==f._domElementKeyEvents&&f._domElementKeyEvents.removeEventListener("keydown",eu)};let f=this,m={type:"change"},h={type:"start"},g={type:"end"},y={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},v=y.NONE,b=1e-6,x=new o.tQ,w=new o.tQ,E=1,S=new o.cE,M=new o.wq,A=new o.wq,C=new o.wq,L=new o.wq,_=new o.wq,T=new o.wq,R=new o.wq,j=new o.wq,P=new o.wq,O=new o.cE,B=new o.wq,D=!1,F=[],z={};function G(){return Math.pow(.95,f.zoomSpeed)}function U(e){f.reverseOrbit||f.reverseHorizontalOrbit?w.theta+=e:w.theta-=e}function q(e){f.reverseOrbit||f.reverseVerticalOrbit?w.phi+=e:w.phi-=e}let W=(u=new o.cE,function(e,t){u.setFromMatrixColumn(t,0),u.multiplyScalar(-e),S.add(u)}),Y=(d=new o.cE,function(e,t){!0===f.screenSpacePanning?d.setFromMatrixColumn(t,1):(d.setFromMatrixColumn(t,0),d.crossVectors(f.object.up,d)),d.multiplyScalar(e),S.add(d)}),Z=(p=new o.cE,function(e,t){let n=f.domElement;if(n&&f.object instanceof o.zm&&f.object.isPerspectiveCamera){let r=f.object.position;p.copy(r).sub(f.target);let i=p.length();W(2*e*(i*=Math.tan(f.object.fov/2*Math.PI/180))/n.clientHeight,f.object.matrix),Y(2*t*i/n.clientHeight,f.object.matrix)}else n&&f.object instanceof o.Sc&&f.object.isOrthographicCamera?(W(e*(f.object.right-f.object.left)/f.object.zoom/n.clientWidth,f.object.matrix),Y(t*(f.object.top-f.object.bottom)/f.object.zoom/n.clientHeight,f.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),f.enablePan=!1)});function K(e){f.object instanceof o.zm&&f.object.isPerspectiveCamera||f.object instanceof o.Sc&&f.object.isOrthographicCamera?E=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),f.enableZoom=!1)}function X(e){if(!f.zoomToCursor||!f.domElement)return;D=!0;let t=f.domElement.getBoundingClientRect(),n=e.clientX-t.left,r=e.clientY-t.top,i=t.width,a=t.height;B.x=n/i*2-1,B.y=-(r/a*2)+1,O.set(B.x,B.y,1).unproject(f.object).sub(f.object.position).normalize()}function $(e){return Math.max(f.minDistance,Math.min(f.maxDistance,e))}function Q(e){M.set(e.clientX,e.clientY)}function J(e){L.set(e.clientX,e.clientY)}function ee(){if(1==F.length)M.set(F[0].pageX,F[0].pageY);else{let e=.5*(F[0].pageX+F[1].pageX),t=.5*(F[0].pageY+F[1].pageY);M.set(e,t)}}function et(){if(1==F.length)L.set(F[0].pageX,F[0].pageY);else{let e=.5*(F[0].pageX+F[1].pageX),t=.5*(F[0].pageY+F[1].pageY);L.set(e,t)}}function en(){let e=F[0].pageX-F[1].pageX,t=F[0].pageY-F[1].pageY,n=Math.sqrt(e*e+t*t);R.set(0,n)}function er(e){if(1==F.length)A.set(e.pageX,e.pageY);else{let t=ef(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);A.set(n,r)}C.subVectors(A,M).multiplyScalar(f.rotateSpeed);let t=f.domElement;t&&(U(2*Math.PI*C.x/t.clientHeight),q(2*Math.PI*C.y/t.clientHeight)),M.copy(A)}function ei(e){if(1==F.length)_.set(e.pageX,e.pageY);else{let t=ef(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);_.set(n,r)}T.subVectors(_,L).multiplyScalar(f.panSpeed),Z(T.x,T.y),L.copy(_)}function ea(e){var t;let n=ef(e),r=e.pageX-n.x,i=e.pageY-n.y,a=Math.sqrt(r*r+i*i);j.set(0,a),P.set(0,Math.pow(j.y/R.y,f.zoomSpeed)),t=P.y,K(E/t),R.copy(j)}function eo(e){var t,n,r;!1!==f.enabled&&(0===F.length&&(null==(t=f.domElement)||t.ownerDocument.addEventListener("pointermove",es),null==(n=f.domElement)||n.ownerDocument.addEventListener("pointerup",el)),r=e,F.push(r),"touch"===e.pointerType?function(e){switch(ep(e),F.length){case 1:switch(f.touches.ONE){case o._l.ROTATE:if(!1===f.enableRotate)return;ee(),v=y.TOUCH_ROTATE;break;case o._l.PAN:if(!1===f.enablePan)return;et(),v=y.TOUCH_PAN;break;default:v=y.NONE}break;case 2:switch(f.touches.TWO){case o._l.DOLLY_PAN:if(!1===f.enableZoom&&!1===f.enablePan)return;f.enableZoom&&en(),f.enablePan&&et(),v=y.TOUCH_DOLLY_PAN;break;case o._l.DOLLY_ROTATE:if(!1===f.enableZoom&&!1===f.enableRotate)return;f.enableZoom&&en(),f.enableRotate&&ee(),v=y.TOUCH_DOLLY_ROTATE;break;default:v=y.NONE}break;default:v=y.NONE}v!==y.NONE&&f.dispatchEvent(h)}(e):function(e){let t;switch(e.button){case 0:t=f.mouseButtons.LEFT;break;case 1:t=f.mouseButtons.MIDDLE;break;case 2:t=f.mouseButtons.RIGHT;break;default:t=-1}switch(t){case o.vN.DOLLY:if(!1===f.enableZoom)return;X(e),R.set(e.clientX,e.clientY),v=y.DOLLY;break;case o.vN.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===f.enablePan)return;J(e),v=y.PAN}else{if(!1===f.enableRotate)return;Q(e),v=y.ROTATE}break;case o.vN.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===f.enableRotate)return;Q(e),v=y.ROTATE}else{if(!1===f.enablePan)return;J(e),v=y.PAN}break;default:v=y.NONE}v!==y.NONE&&f.dispatchEvent(h)}(e))}function es(e){!1!==f.enabled&&("touch"===e.pointerType?function(e){switch(ep(e),v){case y.TOUCH_ROTATE:if(!1===f.enableRotate)return;er(e),f.update();break;case y.TOUCH_PAN:if(!1===f.enablePan)return;ei(e),f.update();break;case y.TOUCH_DOLLY_PAN:if(!1===f.enableZoom&&!1===f.enablePan)return;f.enableZoom&&ea(e),f.enablePan&&ei(e),f.update();break;case y.TOUCH_DOLLY_ROTATE:if(!1===f.enableZoom&&!1===f.enableRotate)return;f.enableZoom&&ea(e),f.enableRotate&&er(e),f.update();break;default:v=y.NONE}}(e):function(e){if(!1!==f.enabled)switch(v){case y.ROTATE:let t;if(!1===f.enableRotate)return;A.set(e.clientX,e.clientY),C.subVectors(A,M).multiplyScalar(f.rotateSpeed),(t=f.domElement)&&(U(2*Math.PI*C.x/t.clientHeight),q(2*Math.PI*C.y/t.clientHeight)),M.copy(A),f.update();break;case y.DOLLY:var n,r;if(!1===f.enableZoom)return;(j.set(e.clientX,e.clientY),P.subVectors(j,R),P.y>0)?(n=G(),K(E/n)):P.y<0&&(r=G(),K(E*r)),R.copy(j),f.update();break;case y.PAN:if(!1===f.enablePan)return;_.set(e.clientX,e.clientY),T.subVectors(_,L).multiplyScalar(f.panSpeed),Z(T.x,T.y),L.copy(_),f.update()}}(e))}function el(e){var t,n,r;(function(e){delete z[e.pointerId];for(let t=0;t<F.length;t++)if(F[t].pointerId==e.pointerId)return void F.splice(t,1)})(e),0===F.length&&(null==(t=f.domElement)||t.releasePointerCapture(e.pointerId),null==(n=f.domElement)||n.ownerDocument.removeEventListener("pointermove",es),null==(r=f.domElement)||r.ownerDocument.removeEventListener("pointerup",el)),f.dispatchEvent(g),v=y.NONE}function ec(e){if(!1!==f.enabled&&!1!==f.enableZoom&&(v===y.NONE||v===y.ROTATE)){var t,n;e.preventDefault(),f.dispatchEvent(h),(X(e),e.deltaY<0)?(t=G(),K(E*t)):e.deltaY>0&&(n=G(),K(E/n)),f.update(),f.dispatchEvent(g)}}function eu(e){if(!1!==f.enabled&&!1!==f.enablePan){let t=!1;switch(e.code){case f.keys.UP:Z(0,f.keyPanSpeed),t=!0;break;case f.keys.BOTTOM:Z(0,-f.keyPanSpeed),t=!0;break;case f.keys.LEFT:Z(f.keyPanSpeed,0),t=!0;break;case f.keys.RIGHT:Z(-f.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),f.update())}}function ed(e){!1!==f.enabled&&e.preventDefault()}function ep(e){let t=z[e.pointerId];void 0===t&&(t=new o.wq,z[e.pointerId]=t),t.set(e.pageX,e.pageY)}function ef(e){return z[(e.pointerId===F[0].pointerId?F[1]:F[0]).pointerId]}this.dollyIn=(e=G())=>{K(E*e),f.update()},this.dollyOut=(e=G())=>{K(E/e),f.update()},this.getScale=()=>E,this.setScale=e=>{K(e),f.update()},this.getZoomScale=()=>G(),void 0!==t&&this.connect(t),this.update()}}let W=a.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:r,enableDamping:o=!0,keyEvents:l=!1,onChange:c,onStart:u,onEnd:d,...p},f)=>{let m=(0,s.f)(e=>e.invalidate),h=(0,s.f)(e=>e.camera),g=(0,s.f)(e=>e.gl),y=(0,s.f)(e=>e.events),v=(0,s.f)(e=>e.setEvents),b=(0,s.f)(e=>e.set),x=(0,s.f)(e=>e.get),w=(0,s.f)(e=>e.performance),E=t||h,S=r||y.connected||g.domElement,M=a.useMemo(()=>new q(E),[E]);return(0,F.f)(()=>{M.enabled&&M.update()},-1),a.useEffect(()=>(l&&M.connect(!0===l?S:l),M.connect(S),()=>void M.dispose()),[l,S,n,M,m]),a.useEffect(()=>{let e=e=>{m(),n&&w.regress(),c&&c(e)},t=e=>{u&&u(e)},r=e=>{d&&d(e)};return M.addEventListener("change",e),M.addEventListener("start",t),M.addEventListener("end",r),()=>{M.removeEventListener("start",t),M.removeEventListener("end",r),M.removeEventListener("change",e)}},[c,u,d,M,m,v]),a.useEffect(()=>{if(e){let e=x().controls;return b({controls:M}),()=>b({controls:e})}},[e,M]),a.createElement("primitive",i({ref:f,object:M,enableDamping:o},p))});var Y=e.i(61949);e.S([m,"PMREMGenerator,c,ShaderChunk,Y,ShaderLib,_,UniformsLib,O,WebGLCubeRenderTarget,P,WebGLRenderer,T,WebGLUtils,U",0,o,"ACESFilmicToneMapping,c2,AddEquation,qR,AddOperation,Kc,AdditiveAnimationBlendMode,Ti,AdditiveBlending,tq,AgXToneMapping,Li,AlphaFormat,jL,AlwaysCompare,IL,AlwaysDepth,Io,AlwaysStencilFunc,nS,AmbientLight,C3,AnimationAction,iB,AnimationClip,a7,AnimationLoader,bz,AnimationMixer,EV,AnimationObjectGroup,j_,AnimationUtils,Je,ArcCurve,lv,ArrayCamera,sm,ArrowHelper,lO,AttachedBindMode,CI,Audio,H,AudioAnalyser,He,AudioContext,g$,AudioListener,pl,AudioLoader,iw,AxesHelper,n8,BackSide,tw,BasicDepthPacking,Yx,BasicShadowMap,bS,BatchedMesh,Hl,BezierInterpolant,IF,Bone,So,BooleanKeyframeTrack,CA,Box2,Xl,Box3,VQ,Box3Helper,rp,BoxGeometry,kG,BoxHelper,av,BufferAttribute,f5,BufferGeometry,ld,BufferGeometryLoader,Kb,ByteType,tr,Cache,BO,Camera,VT,CameraHelper,gO,CanvasTexture,Nk,CapsuleGeometry,aQ,CatmullRomCurve3,$7,CineonToneMapping,d4,CircleGeometry,x5,ClampToEdgeWrapping,Jr,Clock,mR,Color,Es,ColorKeyframeTrack,Hw,ColorManagement,v0,Compatibility,zH,CompressedArrayTexture,wQ,CompressedCubeTexture,zn,CompressedTexture,ZR,CompressedTextureLoader,pt,ConeGeometry,e0,ConstantAlphaFactor,Zl,ConstantColorFactor,Zh,Controls,w1,CubeCamera,pg,CubeDepthTexture,Ag,CubeReflectionMapping,Zm,CubeRefractionMapping,oE,CubeTexture,z0,CubeTextureLoader,Mt,CubeUVReflectionMapping,dZ,CubicBezierCurve,qc,CubicBezierCurve3,Kt,CubicInterpolant,Xv,CullFaceBack,b$,CullFaceFront,Xe,CullFaceFrontBack,pA,CullFaceNone,I5,Curve,c_,CurvePath,WE,CustomBlending,UM,CustomToneMapping,lG,CylinderGeometry,o1,Cylindrical,Vn,Data3DTexture,HY,DataArrayTexture,N,DataTexture,U7,DataTextureLoader,Iq,DataUtils,km,DecrementStencilOp,D$,DecrementWrapStencilOp,$G,DefaultLoadingManager,rA,DepthFormat,tF,DepthStencilFormat,nE,DepthTexture,ei,DetachedBindMode,OH,DirectionalLight,ya,DirectionalLightHelper,mZ,DiscreteInterpolant,sB,DodecahedronGeometry,Va,DoubleSide,Vs,DstAlphaFactor,bf,DstColorFactor,eq,DynamicCopyUsage,yF,DynamicDrawUsage,DT,DynamicReadUsage,Af,EdgesGeometry,nC,EllipseCurve,ig,EqualCompare,WG,EqualDepth,u4,EqualStencilFunc,CW,EquirectangularReflectionMapping,qM,EquirectangularRefractionMapping,fe,Euler,FS,EventDispatcher,q7,ExternalTexture,UN,ExtrudeGeometry,Jy,FileLoader,qJ,Float16BufferAttribute,OS,Float32BufferAttribute,ki,FloatType,h5,Fog,n5,FogExp2,IM,FramebufferTexture,v6,FrontSide,de,Frustum,eW,FrustumArray,ft,GLBufferAttribute,bj,GLSL1,oJ,GLSL3,n,GreaterCompare,UW,GreaterDepth,fu,GreaterEqualCompare,Yi,GreaterEqualDepth,mT,GreaterEqualStencilFunc,VC,GreaterStencilFunc,QX,GridHelper,TK,Group,C9,HTMLTexture,mU,HalfFloatType,HN,HemisphereLight,VF,HemisphereLightHelper,G$,IcosahedronGeometry,Pg,ImageBitmapLoader,li,ImageLoader,x1,ImageUtils,ph,IncrementStencilOp,vM,IncrementWrapStencilOp,n2,InstancedBufferAttribute,VZ,InstancedBufferGeometry,Kx,InstancedInterleavedBuffer,hC,InstancedMesh,YJ,Int16BufferAttribute,fs,Int32BufferAttribute,z7,Int8BufferAttribute,dn,IntType,_h,InterleavedBuffer,k4,InterleavedBufferAttribute,Zq,Interpolant,fN,InterpolateBezier,g3,InterpolateDiscrete,wu,InterpolateLinear,cf,InterpolateSmooth,hG,InterpolationSamplingMode,bJ,InterpolationSamplingType,gY,InvertStencilOp,d5,KeepStencilOp,HR,KeyframeTrack,DI,LOD,T4,LatheGeometry,rj,Layers,DV,LessCompare,BI,LessDepth,Ku,LessEqualCompare,Ey,LessEqualDepth,WO,LessEqualStencilFunc,A0,LessStencilFunc,v1,Light,Ms,LightProbe,Te,LightShadow,Ws,Line,DL,Line3,_i,LineBasicMaterial,NQ,LineCurve,n6,LineCurve3,CH,LineDashedMaterial,rd,LineLoop,XK,LineSegments,a1,LinearFilter,VV,LinearInterpolant,wC,LinearMipMapLinearFilter,Zw,LinearMipMapNearestFilter,Y1,LinearMipmapLinearFilter,Q4,LinearMipmapNearestFilter,_j,LinearSRGBColorSpace,Rg,LinearToneMapping,N9,LinearTransfer,R7,Loader,cD,LoaderUtils,kZ,LoadingManager,im,LoopOnce,ix,LoopPingPong,tn,LoopRepeat,H8,MOUSE,vN,Material,C2,MaterialBlending,sM,MaterialLoader,vr,MathUtils,rB,Matrix2,p9,Matrix3,hm,Matrix4,nd,MaxEquation,Fb,Mesh,kE,MeshBasicMaterial,p$,MeshDepthMaterial,QQ,MeshDistanceMaterial,JA,MeshLambertMaterial,ht,MeshMatcapMaterial,wi,MeshNormalMaterial,y6,MeshPhongMaterial,Z8,MeshPhysicalMaterial,Ox,MeshStandardMaterial,aV,MeshToonMaterial,bR,MinEquation,Tv,MirroredRepeatWrapping,p2,MixOperation,yG,MultiplyBlending,HU,MultiplyOperation,Dv,NearestFilter,r8,NearestMipMapLinearFilter,$h,NearestMipMapNearestFilter,Rh,NearestMipmapLinearFilter,Iy,NearestMipmapNearestFilter,o8,NeutralToneMapping,x8,NeverCompare,K5,NeverDepth,G3,NeverStencilFunc,T0,NoBlending,A1,NoColorSpace,Ik,NoNormalPacking,nN,NoToneMapping,rK,NormalAnimationBlendMode,Aq,NormalBlending,F_,NormalGAPacking,GW,NormalRGPacking,AK,NotEqualCompare,ej,NotEqualDepth,tt,NotEqualStencilFunc,nY,NumberKeyframeTrack,KC,Object3D,t,ObjectLoader,JD,ObjectSpaceNormalMap,dV,OctahedronGeometry,R6,OneFactor,Vt,OneMinusConstantAlphaFactor,Cn,OneMinusConstantColorFactor,LP,OneMinusDstAlphaFactor,PX,OneMinusDstColorFactor,_k,OneMinusSrcAlphaFactor,oL,OneMinusSrcColorFactor,b4,OrthographicCamera,Sc,PCFShadowMap,i8,PCFSoftShadowMap,up,Path,pB,PerspectiveCamera,zm,Plane,_m,PlaneGeometry,CQ,PlaneHelper,WJ,PointLight,SN,PointLightHelper,zs,Points,sy,PointsMaterial,Nj,PolarGridHelper,bL,PolyhedronGeometry,Ko,PositionalAudio,n3,PropertyBinding,lx,PropertyMixer,NE,QuadraticBezierCurve,AG,QuadraticBezierCurve3,pN,Quaternion,as,QuaternionKeyframeTrack,eb,QuaternionLinearInterpolant,of,R11_EAC_Format,va,RED_GREEN_RGTC2_Format,an,RED_RGTC1_Format,jX,REVISION,Tu,RG11_EAC_Format,M7,RGBADepthPacking,Wq,RGBAFormat,W1,RGBAIntegerFormat,Hi,RGBA_ASTC_10x10_Format,h4,RGBA_ASTC_10x5_Format,lD,RGBA_ASTC_10x6_Format,sC,RGBA_ASTC_10x8_Format,$s,RGBA_ASTC_12x10_Format,Am,RGBA_ASTC_12x12_Format,pa,RGBA_ASTC_4x4_Format,Ap,RGBA_ASTC_5x4_Format,CY,RGBA_ASTC_5x5_Format,$c,RGBA_ASTC_6x5_Format,te,RGBA_ASTC_6x6_Format,GB,RGBA_ASTC_8x5_Format,eo,RGBA_ASTC_8x6_Format,GI,RGBA_ASTC_8x8_Format,NA,RGBA_BPTC_Format,Sh,RGBA_ETC2_EAC_Format,zJ,RGBA_PVRTC_2BPPV1_Format,bM,RGBA_PVRTC_4BPPV1_Format,kQ,RGBA_S3TC_DXT1_Format,UP,RGBA_S3TC_DXT3_Format,Cv,RGBA_S3TC_DXT5_Format,U8,RGBDepthPacking,U6,RGBFormat,rs,RGBIntegerFormat,Sa,RGB_BPTC_SIGNED_Format,jY,RGB_BPTC_UNSIGNED_Format,J2,RGB_ETC1_Format,Lx,RGB_ETC2_Format,PE,RGB_PVRTC_2BPPV1_Format,rH,RGB_PVRTC_4BPPV1_Format,BF,RGB_S3TC_DXT1_Format,Ba,RGDepthPacking,X4,RGFormat,V9,RGIntegerFormat,PB,RawShaderMaterial,or,Ray,Wk,Raycaster,zx,RectAreaLight,aU,RedFormat,Tr,RedIntegerFormat,at,ReinhardToneMapping,Gr,RenderObjectRefreshType,L,RenderTarget,k$,RenderTarget3D,C8,RepeatWrapping,FP,ReplaceStencilOp,zA,ReverseSubtractEquation,k,RingGeometry,qZ,SIGNED_R11_EAC_Format,QR,SIGNED_RED_GREEN_RGTC2_Format,r2,SIGNED_RED_RGTC1_Format,N3,SIGNED_RG11_EAC_Format,j6,SRGBColorSpace,nj,SRGBTransfer,W7,Scene,P6,ShaderMaterial,Zg,ShadowMaterial,r7,Shape,Ow,ShapeGeometry,pY,ShapePath,RC,ShapeUtils,DE,ShortType,Fh,Skeleton,S$,SkeletonHelper,xV,SkinnedMesh,mN,Source,j$,Sphere,L0,SphereGeometry,Gu,Spherical,tQ,SphericalHarmonics3,uk,SplineCurve,p,SpotLight,Ou,SpotLightHelper,VG,Sprite,r$,SpriteMaterial,xK,SrcAlphaFactor,tx,SrcAlphaSaturateFactor,AP,SrcColorFactor,Ch,StaticCopyUsage,P2,StaticDrawUsage,f8,StaticReadUsage,wL,StereoCamera,Av,StreamCopyUsage,GS,StreamDrawUsage,cq,StreamReadUsage,_K,StringKeyframeTrack,Sj,SubtractEquation,EI,SubtractiveBlending,DU,TOUCH,_l,TangentSpaceNormalMap,fw,TetrahedronGeometry,SW,Texture,Sk,TextureLoader,H5,TextureSource,dx,TextureUtils,K0,Timer,US,TimestampQuery,RG,TorusGeometry,fa,TorusKnotGeometry,eL,Triangle,x3,TriangleFanDrawMode,wD,TriangleStripDrawMode,ol,TrianglesDrawMode,pV,TubeGeometry,Dn,UVMapping,cl,Uint16BufferAttribute,_1,Uint32BufferAttribute,$3,Uint8BufferAttribute,Xf,Uint8ClampedBufferAttribute,wE,Uniform,MY,UniformsGroup,mY,UniformsUtils,SP,UnsignedByteType,Zi,UnsignedInt101111Type,_L,UnsignedInt248Type,bH,UnsignedInt5999Type,CV,UnsignedIntType,MC,UnsignedShort4444Type,F9,UnsignedShort5551Type,Fi,UnsignedShortType,Za,VSMShadowMap,TR,Vector2,wq,Vector3,cE,Vector4,$i,VectorKeyframeTrack,EA,VideoFrameTexture,vw,VideoTexture,TS,WebGL3DRenderTarget,KR,WebGLArrayRenderTarget,VH,WebGLCoordinateSystem,wy,WebGLRenderTarget,qL,WebGPUCoordinateSystem,Yf,WebXRController,_H,WireframeGeometry,nw,WrapAroundEnding,hs,ZeroCurvatureEnding,JX,ZeroFactor,DB,ZeroSlopeEnding,_n,ZeroStencilOp,R8,createCanvasElement,Nx,error,BQ,getConsoleFunction,ZF,log,W5,setConsoleFunction,Fl,warn,TO,warnOnce,DM"],32009);var Z=e.i(32009);function K(e,t){let n;return(...r)=>{window.clearTimeout(n),n=window.setTimeout(()=>e(...r),t)}}let X=["x","y","top","bottom","left","right","width","height"];var $=e.i(46791);function Q({ref:e,children:t,fallback:n,resize:i,style:o,gl:s,events:l=Y.f,eventSource:c,eventPrefix:u,shadows:d,linear:p,flat:f,legacy:m,orthographic:h,frameloop:g,dpr:y,performance:v,raycaster:b,camera:x,scene:w,onPointerMissed:E,onCreated:S,...M}){a.useMemo(()=>(0,Y.e)(Z),[]);let A=(0,Y.u)(),[C,L]=function({debounce:e,scroll:t,polyfill:n,offsetSize:r}={debounce:0,scroll:!1,offsetSize:!1}){var i,o,s;let l=n||("u"<typeof window?class{}:window.ResizeObserver);if(!l)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[c,u]=(0,a.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),d=(0,a.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:c,orientationHandler:null}),p=e?"number"==typeof e?e:e.scroll:null,f=e?"number"==typeof e?e:e.resize:null,m=(0,a.useRef)(!1);(0,a.useEffect)(()=>(m.current=!0,()=>void(m.current=!1)));let[h,g,y]=(0,a.useMemo)(()=>{let e=()=>{let e,t;if(!d.current.element)return;let{left:n,top:i,width:a,height:o,bottom:s,right:l,x:c,y:p}=d.current.element.getBoundingClientRect(),f={left:n,top:i,width:a,height:o,bottom:s,right:l,x:c,y:p};d.current.element instanceof HTMLElement&&r&&(f.height=d.current.element.offsetHeight,f.width=d.current.element.offsetWidth),Object.freeze(f),m.current&&(e=d.current.lastBounds,t=f,!X.every(n=>e[n]===t[n]))&&u(d.current.lastBounds=f)};return[e,f?K(e,f):e,p?K(e,p):e]},[u,r,p,f]);function v(){d.current.scrollContainers&&(d.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",y,!0)),d.current.scrollContainers=null),d.current.resizeObserver&&(d.current.resizeObserver.disconnect(),d.current.resizeObserver=null),d.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",d.current.orientationHandler))}function b(){d.current.element&&(d.current.resizeObserver=new l(y),d.current.resizeObserver.observe(d.current.element),t&&d.current.scrollContainers&&d.current.scrollContainers.forEach(e=>e.addEventListener("scroll",y,{capture:!0,passive:!0})),d.current.orientationHandler=()=>{y()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",d.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",d.current.orientationHandler))}return i=y,o=!!t,(0,a.useEffect)(()=>{if(o)return window.addEventListener("scroll",i,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",i,!0)},[i,o]),s=g,(0,a.useEffect)(()=>(window.addEventListener("resize",s),()=>void window.removeEventListener("resize",s)),[s]),(0,a.useEffect)(()=>{v(),b()},[t,y,g]),(0,a.useEffect)(()=>v,[]),[e=>{e&&e!==d.current.element&&(v(),d.current.element=e,d.current.scrollContainers=function e(t){let n=[];if(!t||t===document.body)return n;let{overflow:r,overflowX:i,overflowY:a}=window.getComputedStyle(t);return[r,i,a].some(e=>"auto"===e||"scroll"===e)&&n.push(t),[...n,...e(t.parentElement)]}(e),b())},c,h]}({scroll:!0,debounce:{scroll:50,resize:0},...i}),_=a.useRef(null),T=a.useRef(null);a.useImperativeHandle(e,()=>_.current);let R=(0,Y.a)(E),j=a.useCallback(e=>null==R.current?void 0:R.current(e),[R]),[P,O]=a.useState(!1),[B,D]=a.useState(!1);if(P)throw P;if(B)throw B;let F=a.useRef(null),[z,G]=(0,Y.b)(),U=a.useRef(null),I=()=>c?(0,Y.i)(c)?c.current:c:T.current;a.useInsertionEffect(()=>()=>{let e=F.current;F.current=null,null==e||e.unmount()},[]),(0,Y.c)(()=>{let e=_.current;L.width>0&&L.height>0&&e&&(F.current||(F.current=(0,Y.d)(e)),F.current.configure({gl:s,scene:w,events:l,shadows:d,linear:p,flat:f,legacy:m,orthographic:h,frameloop:g,dpr:y,performance:v,raycaster:b,camera:x,size:L,onPointerMissed:j,onCreated:e=>{var t;U.current=e,null==e.events.connect||e.events.connect(null!=(t=I())?t:T.current),u&&e.setEvents({compute:(e,t)=>{let n=e[u+"X"],r=e[u+"Y"];t.pointer.set(n/t.size.width*2-1,-(2*(r/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==S||S(e)}}).catch(D),"fulfilled"===F.current.ready.status?F.current.render((0,r.jsx)(A,{children:(0,r.jsx)(Y.E,{set:D,children:(0,r.jsx)(a.Suspense,{fallback:(0,r.jsx)(Y.B,{set:O}),children:null!=t?t:null})})})):"pending"===F.current.ready.status&&G(F.current.ready))}),a.useEffect(()=>{var e;let t=null==(e=U.current)?void 0:e.get(),n=I();t&&n&&t.events.connected!==n&&(null==t.events.connect||t.events.connect(n))}),a.useEffect(()=>{let e=_.current;return()=>{var t;e.isConnected||null==(t=F.current)||t.unmount()}},[]);let N=c?"none":"auto";return(0,r.jsxs)("div",{ref:T,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:N,...o},...M,children:[(0,r.jsx)("div",{ref:C,style:{width:"100%",height:"100%"},children:(0,r.jsx)("canvas",{ref:_,style:{display:"block"},children:n})}),z]})}function J(e){return(0,r.jsx)($.Z,{children:(0,r.jsx)(Q,{...e})})}e.i(89499),o.ZF()||o.Fl(function(e,t,...n){if(t.startsWith("THREE.Clock: This module has been deprecated."))return;let r=n[0];r&&"object"==typeof r&&r.isStackTrace?console[e](r.getError(t)):console[e](t,...n)});var ee=o;class et extends ee.P6{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let e=new ee.kG;e.deleteAttribute("uv");let t=new ee.aV({side:ee.tw}),n=new ee.aV,r=new ee.SN(0xffffff,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new ee.kE(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new ee.YJ(e,n,6),o=new ee.t;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new ee.kE(e,en(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let l=new ee.kE(e,en(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let c=new ee.kE(e,en(17));c.position.set(14.904,12.198,-1.832),c.scale.set(.15,4.265,6.331),this.add(c);let u=new ee.kE(e,en(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new ee.kE(e,en(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let p=new ee.kE(e,en(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;for(let t of(this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))}),e))t.dispose()}}function en(e){return new ee.ht({color:0,emissive:0xffffff,emissiveIntensity:e})}var er=e.i(87831);function ei(e){let t=new o.ld;for(let[n,r,i]of(t.setAttribute("position",new o.f5(e.position,3)),t.setAttribute("normal",new o.f5(e.normal,3)),t.setAttribute("uv",new o.f5(e.uv,2)),e.groups??[]))t.addGroup(n,r,i);return t.computeBoundingSphere(),t}function ea(e){let t=new o.ld;return t.setAttribute("position",new o.f5(e,3)),t}var eo=e.i(19177),es=e.i(46378),el=e.i(53144);function ec(e){let t=(0,el.Y)(e.region.outer),n=(t.minX+t.maxX)/2,r=(t.minY+t.maxY)/2,i=e.thickness/2,{origin:a,u:o,v:s,n:l}=e.frame;return[0,1,2].map(e=>a[e]+o[e]*n+s[e]*r+l[e]*i)}let eu=e=>{let t=Math.hypot(e[0],e[1],e[2])||1;return[e[0]/t,e[1]/t,e[2]/t]};function ed(){let e=document.createElement("canvas");return e.width=e.height=512,[e,e.getContext("2d")]}function ep(e,t){let n=new o.Nk(e);return n.colorSpace=o.nj,n.wrapS=n.wrapT=o.FP,n.repeat.set(t[0],t[1]),n.anisotropy=4,n}let ef=new Map,em=new Map,eh=new Map,eg=new o.nd;function ey(e,t){let n=(0,a.useMemo)(()=>e?t(e):null,[e]);return(0,a.useEffect)(()=>()=>n?.dispose(),[n]),n}function ev({positions:e,...t}){let n=(0,a.useRef)(null),i=(0,a.useMemo)(()=>[0,0,0,1,0,0],[]);return(0,a.useLayoutEffect)(()=>{let t=n.current;t&&(t.geometry.setPositions(e),t.computeLineDistances())},[e]),(0,r.jsx)(D,{ref:n,segments:!0,points:i,raycast:()=>null,...t})}function eb({box:e}){let{origin:t,u:n,v:i,n:s}=e.frame,l=(0,a.useMemo)(()=>{let r=new o.nd().makeBasis(new o.cE(...n),new o.cE(...i),new o.cE(...s));return r.setPosition(new o.cE(...t)),r.multiply(new o.nd().makeTranslation(e.size[0]/2,e.size[1]/2,e.size[2]/2))},[t,n,i,s,e.size]);return(0,r.jsxs)("mesh",{matrixAutoUpdate:!1,matrix:l,castShadow:!0,children:[(0,r.jsx)("boxGeometry",{args:e.size}),(0,r.jsx)("meshPhysicalMaterial",{color:e.color,roughness:.25,clearcoat:.6,transparent:(e.opacity??1)<1,opacity:e.opacity??1})]})}let ex={steel:{color:"#c8c9cc",roughness:.22},gold:{color:"#d8b25a",roughness:.25}};function ew({prop:e}){let t=(0,a.useMemo)(()=>new o.as().setFromUnitVectors(new o.cE(0,0,1),new o.cE(...e.normal).normalize()),[e.normal]),n=ex[e.metal??"steel"];return(0,r.jsxs)("mesh",{position:e.center,quaternion:t,castShadow:!0,children:[(0,r.jsx)("torusGeometry",{args:[e.radius,e.wire/2,16,72]}),(0,r.jsx)("meshStandardMaterial",{color:n.color,metalness:1,roughness:n.roughness})]})}function eE({prop:e}){let t=(0,a.useMemo)(()=>{let t=new o.$7(e.points.map(e=>new o.cE(...e)));return new o.Dn(t,Math.max(24,12*e.points.length),e.radius,10,!1)},[e.points,e.radius]);(0,a.useEffect)(()=>()=>t.dispose(),[t]);let n=e.metal?ex[e.metal]:null;return(0,r.jsx)("mesh",{geometry:t,castShadow:!0,children:(0,r.jsx)("meshStandardMaterial",{color:n?.color??e.color??"#1d1b19",metalness:+!!n,roughness:n?.roughness??.6})})}function eS({prop:e,reach:t}){let n=e.color??"#ffcf87",i=(0,a.useMemo)(()=>new o.Es(n).multiplyScalar(4),[n]);return(0,r.jsxs)("group",{position:e.center,children:["strip"===e.shape&&e.size?(0,r.jsxs)("mesh",{children:[(0,r.jsx)("boxGeometry",{args:e.size}),(0,r.jsx)("meshBasicMaterial",{color:i,toneMapped:!1})]}):(0,r.jsxs)("mesh",{scale:"flame"===e.shape?[.55,.55,1.1]:[1,1,1.08],children:[(0,r.jsx)("sphereGeometry",{args:[e.radius,32,24]}),(0,r.jsx)("meshBasicMaterial",{color:i,toneMapped:!1})]}),(0,r.jsx)("pointLight",{color:n,intensity:2.2,distance:t,decay:1})]})}function eM({props:e,reach:t}){return(0,r.jsx)(r.Fragment,{children:e.map((e,n)=>"ring"===e.kind?(0,r.jsx)(ew,{prop:e},n):"wire"===e.kind?(0,r.jsx)(eE,{prop:e},n):(0,r.jsx)(eS,{prop:e,reach:t},n))})}function eA({part:e,mesh:t,matrix:n,appearanceId:i,dimmed:s}){let l=(0,eo.i)(i),c=t.marksLift,u=(0,a.useMemo)(()=>n.clone().multiply(new o.nd().makeTranslation(0,0,c)),[n,c]),d=ey(t.engrave,ei),p=ey(t.score,ea),f=ey(t.slits,ea),m=e.bend?eg:u,h="acrylic"===l.kind?"#f5f5f2":"walnut"===l.id?"#24150c":"#4b2d17";return(0,r.jsxs)(r.Fragment,{children:[d&&(0,r.jsx)("mesh",{geometry:d,matrixAutoUpdate:!1,matrix:m,children:(0,r.jsx)("meshStandardMaterial",{color:h,roughness:1,side:o.Vs,transparent:!0,opacity:s?.15:"acrylic"===l.kind?.85:.92,polygonOffset:!0,polygonOffsetFactor:-2})}),p&&(0,r.jsx)("lineSegments",{geometry:p,matrixAutoUpdate:!1,matrix:m,children:(0,r.jsx)("lineBasicMaterial",{color:h,transparent:!0,opacity:s?.1:.55})}),f&&(0,r.jsx)("lineSegments",{geometry:f,matrixAutoUpdate:!1,matrix:m,children:(0,r.jsx)("lineBasicMaterial",{color:"#1c140d",transparent:!0,opacity:s?.15:(e.cutLines?.length??0)>120?.7:.95})})]})}function eC(e){let t=new o.VQ;for(let n of e.parts)for(let[e,r]of n.bend?(0,er.n)(n.region,5).outer:n.region.outer)t.expandByPoint(new o.cE(...(0,es.f)(n,e,r,0))),t.expandByPoint(new o.cE(...(0,es.f)(n,e,r,n.thickness)));for(let n of e.decor??[]){let{origin:e,u:r,v:i,n:a}=n.frame;for(let s of[0,n.size[0]])for(let l of[0,n.size[1]])for(let c of[0,n.size[2]])t.expandByPoint(new o.cE(e[0]+r[0]*s+i[0]*l+a[0]*c,e[1]+r[1]*s+i[1]*l+a[1]*c,e[2]+r[2]*s+i[2]*l+a[2]*c))}for(let n of e.props??[])if("ring"===n.kind)t.expandByPoint(new o.cE(...n.center).addScalar(n.radius)).expandByPoint(new o.cE(...n.center).subScalar(n.radius));else if("wire"===n.kind)for(let e of n.points)t.expandByPoint(new o.cE(...e));return t.isEmpty()&&t.set(new o.cE(-50,-50,0),new o.cE(50,50,100)),t}let eL=!1;{let e=window.matchMedia("(prefers-reduced-motion: reduce)");eL=e.matches,e.addEventListener("change",e=>eL=e.matches)}function e_(e){if(!new URLSearchParams(window.location.search).has("perf"))return;let t=window;t[e]=(t[e]??0)+1}function eT(){let e=(0,s.f)(e=>e.get);return(0,a.useCallback)(()=>{e().gl.shadowMap.needsUpdate=!0,e_("__pohoShadowUpdates")},[e])}function eR({design:e}){let t=eT(),n=(0,s.f)(e=>e.invalidate);return(0,a.useEffect)(()=>{t(),n()},[e,t,n]),null}let ej=window.matchMedia("(pointer: coarse)").matches||(navigator.hardwareConcurrency??8)<=4||function(){try{let e=document.createElement("canvas").getContext("webgl2");if(!e)return!0;let t=e.getExtension("WEBGL_debug_renderer_info"),n=String(t?e.getParameter(t.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER));return e.getExtension("WEBGL_lose_context")?.loseContext(),/swiftshader|llvmpipe|softpipe|software|basic render/i.test(n)}catch{return!0}}()?"low":"high";function eP({part:e,mesh:t,glide:n=9,appearanceId:i,target:l,dimmed:c,selected:u,onSelect:d,hidden:p,enterKey:f,enterFrom:m,explodeRef:h,targetFor:g}){let y=(0,a.useRef)(null),v=(0,s.f)(e=>e.invalidate),[b,x]=(0,a.useState)(!1),w=(0,a.useMemo)(()=>t??(0,er.X)(e),[t,e]),E=ey(w.body,ei),S=(0,a.useMemo)(()=>(function(e){let{origin:t,u:n,v:r,n:i}=e.frame;return new o.nd().makeBasis(new o.cE(...n),new o.cE(...r),new o.cE(...i)).setPosition(new o.cE(...t))})(e),[e]),M=e.bend?eg:S,A=function(e,t){let n,r=`${e.id}@${t.toFixed(2)}`,i=eh.get(r);if(i)return eh.delete(r),eh.set(r,i),i;if("acrylic"===e.kind){let t=(e.opacity??1)<1,r=new o.Ox({color:e.base,roughness:e.roughness,metalness:.85*("acrylic-gold"===e.id),clearcoat:1,clearcoatRoughness:.08,transparent:t,opacity:e.opacity??1,depthWrite:!t,side:o.Vs}),i=r.clone();i.color=new o.Es(e.edge),i.roughness=.35,n=[r,i]}else{let r,i=((r=ef.get(e.id))||ef.set(e.id,r=function(e){let t,[n,r]=ed(),i=(t=7919*e.id.length+e.base.charCodeAt(1)>>>0,()=>(t=1664525*t+0x3c6ef35f>>>0)/0x100000000);if(r.fillStyle=e.base,r.fillRect(0,0,512,512),"wood"===e.kind)for(let t=0;t<70;t++){let t=512*i(),n=2+6*i(),a=.004+.01*i(),o=i()*Math.PI*2;r.strokeStyle=e.grain,r.globalAlpha=.15+.35*i(),r.lineWidth=.6+2.2*i(),r.beginPath();for(let e=-4;e<=516;e+=8){let i=t+Math.sin(e*a+o)*n;-4===e?r.moveTo(e,i):r.lineTo(e,i)}r.stroke()}else if("mdf"===e.kind||"card"===e.kind)for(let t=0;t<9e3;t++){r.fillStyle=e.grain,r.globalAlpha=.08+.18*i();let t="card"===e.kind?.6+1.6*i():.8+i();r.fillRect(512*i(),512*i(),t*("card"===e.kind?3:1),t)}return r.globalAlpha=1,ep(n,[1/140,1/140])}(e)),r);n=[new o.aV({map:i,bumpMap:"wood"===e.kind?i:null,bumpScale:.8,roughness:e.roughness,metalness:0}),new o.aV({map:function(e,t){let n="birch"===e.id||"walnut"===e.id?Math.max(3,Math.round(t)):0,r=`${e.id}:${n}`,i=em.get(r);if(!i){let[t,a]=ed();a.fillStyle=e.edge,a.fillRect(0,0,512,512);for(let e=0;e<n;e++)a.fillStyle=e%2?"rgba(255,240,215,0.10)":"rgba(0,0,0,0.12)",a.fillRect(0,e/n*512,512,512/n);i=ep(t,[1,1]),em.set(r,i)}let a=i.clone();return a.repeat.set(1/140,1/t),a.needsUpdate=!0,a}(e,t),roughness:.95,metalness:0})]}if(eh.set(r,n),eh.size>16){let e=eh.keys().next().value;for(let t of eh.get(e)){let e=t.map;e&&![...ef.values()].includes(e)&&e.dispose(),t.dispose()}eh.delete(e)}return n}((0,eo.i)(i),e.thickness),C=(0,a.useMemo)(()=>{let t=e.bend?A.map(e=>{let t=e.clone();return t.side=o.Vs,t}):A;return c?t.map(e=>{let t=e.clone();return t.transparent=!0,t.opacity=.18,t.depthWrite=!1,t}):t},[A,c,e.bend]);(0,a.useEffect)(()=>()=>{C!==A&&C.forEach(e=>e.dispose())},[C,A]),(0,a.useEffect)(()=>()=>{b&&(document.body.style.cursor="")},[b]);let L=(0,a.useRef)(null);(0,a.useEffect)(()=>{L.current?L.current.set(...l):L.current=new o.cE(...l),v()},[l,v]);let _=eT();(0,a.useEffect)(()=>{_(),v()},[p,E,M,_,v]);let T=(0,a.useRef)(m);return(0,a.useEffect)(()=>{T.current=m},[m]),(0,a.useEffect)(()=>{let e=y.current;f&&e&&T.current&&!eL&&(e.position.set(...T.current),v())},[f,v]),(0,F.f)((e,t)=>{let r=y.current,i=L.current;if(!r||!i||(h&&g&&i.set(...g(h.current)),0===r.position.distanceToSquared(i)))return;if(_(),eL)return void r.position.copy(i);let a=1-Math.exp(-t*n);r.position.lerp(i,a),r.position.distanceToSquared(i)>1e-4?v():r.position.copy(i)}),(0,r.jsxs)("group",{ref:y,visible:!p,children:[(0,r.jsx)("mesh",{geometry:E,material:C,matrixAutoUpdate:!1,matrix:M,castShadow:!0,receiveShadow:!0,onPointerOver:e=>{e.stopPropagation(),x(!0),document.body.style.cursor="pointer"},onPointerOut:()=>{x(!1),document.body.style.cursor=""},onClick:t=>{t.stopPropagation(),d(u?null:e.id)},children:(0,r.jsx)(ev,{positions:w.edges,color:u||b?"#2d6a4f":"#2b2118",lineWidth:u?2:1,transparent:!0,opacity:c?.15:u||b?.9:.22})}),(0,r.jsx)(eA,{part:e,mesh:w,matrix:S,appearanceId:i,dimmed:c})]})}function eO({bounds:e,fitNonce:t,designKey:n,overhead:r,margin:i=1.3}){let l=(0,s.f)(e=>e.get),c=(0,s.f)(e=>!!e.controls),u=(0,a.useRef)(e);return(0,a.useEffect)(()=>{u.current=e},[e]),(0,a.useEffect)(()=>{let e=l(),t=e.camera,n=e.controls,a=u.current.getBoundingSphere(new o.L0),s=new o.cE(a.center.x,a.center.z,-a.center.y),c=t.fov*Math.PI/180,d=2*Math.atan(Math.tan(c/2)*t.aspect),p=Math.min(c,d),f=a.radius/Math.sin(p/2)*i,m=(r?new o.cE(.35,1.6,.9):new o.cE(.9,.75,1.25)).normalize();t.position.copy(s).addScaledVector(m,f),t.near=Math.max(.5,f/100),t.far=20*f,t.updateProjectionMatrix(),n?(n.target.copy(s),n.update()):t.lookAt(s),e.invalidate()},[t,n,c,l,r,i]),null}function eB({parts:e,faceTo:t}){let n=(0,s.f)(e=>e.get),r=(0,a.useRef)(null),i=(0,a.useRef)(e);return(0,a.useEffect)(()=>{i.current=e},[e]),(0,a.useEffect)(()=>{let e=function(e,t){let n=e.find(e=>e.id===t);if(!n)return null;let r=e.map(ec),i=[0,1,2].map(e=>(Math.min(...r.map(t=>t[e]))+Math.max(...r.map(t=>t[e])))/2),a=ec(n),o=[a[0]-i[0],a[1]-i[1],a[2]-i[2]],s=n.frame.n,l=s[0]*o[0]+s[1]*o[1]+s[2]*o[2]<0?-1:1,c=[s[0]*l,s[1]*l,s[2]*l];return c[2]<-.5?eu([0,-1,.32]):c[2]>.5?eu([.15*c[0],.15*c[1]-.15,1]):eu([c[0],c[1],c[2]+.32])}(i.current,t.partId),a=n(),s=a.controls;if(!e||!s)return;let l=s.target,c=a.camera.position.distanceTo(l),u=new o.cE(e[0],e[2],-e[1]).normalize(),d=a.camera.position.clone().sub(l).normalize();if(eL){a.camera.position.copy(l).addScaledVector(u,c),s.update(),a.invalidate();return}r.current={from:d,to:u,start:performance.now()},a.invalidate()},[t.partId,t.nonce,n]),(0,F.f)(e=>{let t=r.current,n=e.controls;if(!t||!n)return;let i=Math.min(1,(performance.now()-t.start)/520),a=1-Math.pow(1-i,3),o=e.camera.position.distanceTo(n.target),s=t.from.clone().lerp(t.to,a).normalize();e.camera.position.copy(n.target).addScaledVector(s,o),n.update(),i<1?e.invalidate():r.current=null}),null}function eD(){let e=(0,s.f)(e=>e.get);return(0,a.useEffect)(()=>{let{gl:t,scene:n}=e(),r=new m.c(t),i=r.fromScene(new et,.04).texture;return n.environment=i,n.environmentIntensity=.35,()=>{i.dispose(),r.dispose()}},[e]),null}function eF({maxDim:e}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("hemisphereLight",{args:["#fff6ea","#cfc4b4",.45]}),(0,r.jsx)("directionalLight",{position:[-(.9*e),1.7*e,1.7*e],color:"#ffeedd",intensity:2.4,castShadow:!0,"shadow-mapSize":[2048,2048],"shadow-camera-left":-(2.6*e),"shadow-camera-right":2.6*e,"shadow-camera-top":2.6*e,"shadow-camera-bottom":-(2.6*e),"shadow-camera-near":.2*e,"shadow-camera-far":6*e,"shadow-bias":-2e-4,"shadow-normalBias":.0012*e,"shadow-radius":6,"shadow-blurSamples":16}),(0,r.jsx)("directionalLight",{position:[1.9*e,.7*e,.3*e],color:"#dde6ff",intensity:.45}),(0,r.jsx)("directionalLight",{position:[.4*e,1.1*e,-(2*e)],color:"#fff1dc",intensity:1.1})]})}function ez({onReady:e}){let t=(0,a.useRef)(0),n=(0,a.useRef)(!1),r=(0,s.f)(e=>e.invalidate);return(0,F.f)(()=>{n.current||(++t.current>=6?(n.current=!0,e()):r())}),null}let eG=(0,a.lazy)(()=>e.A(43480));function eU(){let e=(0,s.f)(e=>e.get);return(0,a.useLayoutEffect)(()=>{e().gl.toneMapping=o.x8},[e]),null}function eI({enabled:e,quality:t,maxDim:n,glow:i,onReady:o}){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(eU,{}),e?(0,r.jsxs)(a.Suspense,{fallback:null,children:[(0,r.jsx)(eG,{quality:t,maxDim:n,glow:i}),o&&(0,r.jsx)(ez,{onReady:o})]}):o&&(0,r.jsx)(ez,{onReady:o})]})}function eN({width:e}){let t=Math.max(.52*e,60);return(0,r.jsxs)("group",{rotation:[Math.PI/2,0,0],children:[(0,r.jsxs)("mesh",{position:[0,-35,0],receiveShadow:!0,children:[(0,r.jsx)("cylinderGeometry",{args:[t,t,70,96]}),(0,r.jsx)("meshStandardMaterial",{color:"#f7efe6",roughness:.85})]}),(0,r.jsxs)("mesh",{position:[0,-1.5,0],rotation:[Math.PI/2,0,0],children:[(0,r.jsx)("torusGeometry",{args:[t-3,3.5,12,96]}),(0,r.jsx)("meshStandardMaterial",{color:"#f3c9c4",roughness:.7})]})]})}function ek({top:e}){return(0,r.jsxs)("mesh",{position:[0,0,e+40],rotation:[Math.PI/2,0,0],children:[(0,r.jsx)("cylinderGeometry",{args:[.4,.4,80,8]}),(0,r.jsx)("meshStandardMaterial",{color:"#b0362f",roughness:.9})]})}function eH(e,t){let n=e=>{let t=Math.min(1,Math.max(0,e));return t*t*(3-2*t)};return t?{lidT:n(e/.35),apartT:n((e-.35)/.65)}:{lidT:0,apartT:n(e)}}function eV({design:e,meshes:t,bounds:n,appearanceId:i,explode:s,glide:l,selectedPart:c,onSelect:u,assemblyStep:d,explodeRef:p}){let f=n.getSize(new o.cE),m=Math.max(f.x,f.y,f.z),h=f.z,g=(0,a.useCallback)((t,n)=>{let{lidT:r,apartT:i}=eH(n,!!e.lid),a=.14*m*i,o=[0,0,0];for(let e=0;e<3;e++)o[e]+=t.explode[e]*a;if("lid"===t.group&&(o[2]+=1.2*a),"dividers"===t.group&&(o[2]+=.75*h*i),r>0&&e.lid&&t.group===e.lid.group)if("lift"===e.lid.kind)o[2]+=e.lid.distance*r;else for(let t=0;t<3;t++)o[t]+=e.lid.direction[t]*e.lid.distance*r;return o},[e.lid,m,h]),y=(0,a.useMemo)(()=>e.parts.map(e=>g(e,s)),[e.parts,g,s]),v=(0,a.useMemo)(()=>e.parts.map(e=>t=>g(e,t)),[e.parts,g]),b=(0,a.useRef)(null),x=eT();(0,F.f)(()=>{let e=b.current;if(!e||!p)return;let t=p.current<.02;e.visible!==t&&(e.visible=t,x())});let w=(0,a.useMemo)(()=>{let t=new Map;return e.assembly?.forEach((e,n)=>e.parts.forEach(e=>t.set(e,n))),t},[e.assembly]),E=null!==d&&!!e.assembly?.length;return(0,r.jsxs)(r.Fragment,{children:[e.parts.map((e,n)=>{let a=w.get(e.id),o=E&&a===d;return(0,r.jsx)(eP,{part:e,mesh:t[e.id],glide:l,appearanceId:i,target:y[n],dimmed:!E&&!!c&&c!==e.id,selected:E?o:c===e.id,onSelect:u,hidden:E&&void 0!==a&&a>d,enterKey:o?`step-${d}`:null,enterFrom:[e.explode[0]*m*.35,e.explode[1]*m*.35,e.explode[2]*m*.35+("lid"===e.group?.3*m:0)],explodeRef:p,targetFor:p?v[n]:void 0},e.id)}),"cake"===e.scene&&(0,r.jsx)(eN,{width:f.x}),"hanging"===e.scene&&(0,r.jsx)(ek,{top:n.max.z}),p?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("group",{ref:b,children:[e.decor?.map((e,t)=>(0,r.jsx)(eb,{box:e},t)),e.props&&(0,r.jsx)(eM,{props:e.props.filter(e=>"light"!==e.kind),reach:2.5*m})]}),e.props&&(0,r.jsx)(eM,{props:e.props.filter(e=>"light"===e.kind),reach:2.5*m})]}):(0,r.jsxs)(r.Fragment,{children:[s<.02&&e.decor?.map((e,t)=>(0,r.jsx)(eb,{box:e},t)),e.props&&(0,r.jsx)(eM,{props:s<.02?e.props:e.props.filter(e=>"light"===e.kind),reach:2.5*m})]})]})}function eq(e){return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)}function eW({turnsPerMinute:e}){let t=(0,s.f)(e=>e.invalidate),n=(0,a.useRef)(null),r=(0,a.useRef)(!1);return(0,F.f)(t=>{if(!r.current)return;r.current=!1;let i=performance.now(),a=null===n.current?0:Math.min((i-n.current)/1e3,.25);n.current=i,function(e,t,n,r){if(!t||n<=0)return;let i=2*Math.PI/60*r*n;e.position.sub(t.target).applyAxisAngle(e.up,i).add(t.target),e.lookAt(t.target)}(t.camera,t.controls,a,e)},-2),(0,a.useEffect)(()=>{let e=0,n=0,i=a=>{e=requestAnimationFrame(i),a-n<48||(n=a,r.current=!0,t())};return e=requestAnimationFrame(i),()=>cancelAnimationFrame(e)},[t]),null}function eY({sequence:e,explodeRef:t}){let n=(0,s.f)(e=>e.invalidate),r=(0,a.useRef)(null),i=e.reduce((e,[,t])=>e+t,0);return(0,F.f)(n=>{let a=1e3*n.clock.elapsedTime;r.current??=a;let o=a-r.current-eZ;if(!(o<0)&&!(i<=0))for(let[n,r]of(o%=i,e)){if(o<r){t.current=n;return}o-=r}}),(0,a.useEffect)(()=>{let t=setInterval(n,Math.max(250,Math.min(...e.map(([,e])=>e))/2));return()=>clearInterval(t)},[e,n]),null}let eZ=600;function eK({drawing:e}){let t=(0,s.f)(e=>e.invalidate);return(0,a.useEffect)(()=>{e&&t()},[e,t]),null}e.s(["Scene3D",0,function(e){let{autoRotate:t,fitNonce:n,designKey:i,active:s,onSelect:l,showcase:c}=e;(0,a.useEffect)(()=>e_("__pohoSceneRenders"));let u=(0,a.useMemo)(()=>e.showcase&&e.design.decor?{...e.design,decor:void 0}:e.design,[e.showcase,e.design]),d=(0,a.useMemo)(()=>eC(u),[u]),p=(d.min.x+d.max.x)/2,f=(d.min.y+d.max.y)/2,m=(0,a.useMemo)(()=>d.clone().translate(new o.cE(-p,-f,0)),[d,p,f]),h=m.getSize(new o.cE),g=Math.max(h.x,h.y,h.z,40),y="cake"===u.scene?-70:m.min.z,v=(0,a.useRef)(null),b=function(e){let[t,n]=(0,a.useState)(!0),r=(0,a.useSyncExternalStore)(eq,()=>"hidden"!==document.visibilityState,()=>!0);return(0,a.useEffect)(()=>{let t=e.current;if(!t||"u"<typeof IntersectionObserver)return;let r=new IntersectionObserver(([e])=>n(e.isIntersecting));return r.observe(t),()=>r.disconnect()},[e]),t&&r}(v),x=s&&b,w=t&&x&&!eL,E=e.quality??ej,S=!!u.props?.some(e=>"light"===e.kind),M=e.explodeSequence&&e.explodeSequence.length>0&&!eL?e.explodeSequence:null,A=(0,a.useRef)(e.explode),[C]=(0,a.useState)("low"===E);return(0,r.jsxs)(J,{ref:v,frameloop:x?"demand":"never",shadows:{type:o.TR},onCreated:({gl:e})=>{e.shadowMap.autoUpdate=!1},dpr:[1,1.75],camera:{fov:32,position:[300,250,400],near:1,far:1e4},flat:!0,gl:{antialias:C,preserveDrawingBuffer:!!e.onReady&&!c,stencil:!1,premultipliedAlpha:!1},onPointerMissed:()=>l(null),role:"img","aria-label":"3D preview",children:[(0,r.jsx)(eR,{design:u}),(0,r.jsx)(eD,{}),(0,r.jsx)(eF,{maxDim:g}),(0,r.jsx)("group",{rotation:[-Math.PI/2,0,0],children:(0,r.jsx)("group",{position:[-p,-f,0],children:(0,r.jsx)(eV,{...e,design:u,bounds:d,glide:c?2.2:9,explodeRef:M?A:void 0})})}),(0,r.jsxs)("mesh",{rotation:[-Math.PI/2,0,0],position:[0,y-.05,0],receiveShadow:!0,children:[(0,r.jsx)("planeGeometry",{args:[6*g,6*g]}),(0,r.jsx)("shadowMaterial",{color:"#2a1d12",opacity:c?.14:.18})]}),(0,r.jsx)(eI,{enabled:"high"===E||S,quality:E,maxDim:g,glow:S,onReady:e.onReady}),(0,r.jsx)(W,{makeDefault:!0,enableDamping:!0,dampingFactor:.12,autoRotate:!1,enableZoom:!c,enablePan:!c,minDistance:.3*g,maxDistance:8*g,maxPolarAngle:.495*Math.PI}),w&&(0,r.jsx)(eW,{turnsPerMinute:c?1.2:.8}),(0,r.jsx)(eK,{drawing:x}),M&&x&&(0,r.jsx)(eY,{sequence:M,explodeRef:A}),e.faceTo&&(0,r.jsx)(eB,{parts:u.parts,faceTo:e.faceTo}),(0,r.jsx)(eO,{bounds:m,fitNonce:n,designKey:i,overhead:"flat"===u.scene,margin:e.fitMargin??(c&&u.lid?1.7:1.3)})]})},"designBounds",0,eC,"explodePhases",0,eH],43971)},15983,function(e){e.n(e.i(43971))}]);