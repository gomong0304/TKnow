package ticketnow.modules.ticket.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ticketnow.modules.common.domain.ImageVO;
import ticketnow.modules.common.dto.image.ImageListDTO;
import ticketnow.modules.common.dto.image.NewImageDTO;
import ticketnow.modules.common.dto.paging.PageRequestDTO;
import ticketnow.modules.common.dto.paging.PageResponseDTO;
import ticketnow.modules.common.service.image.FileService;
import ticketnow.modules.ticket.constant.TicketStatus;
import ticketnow.modules.ticket.dto.*;
import ticketnow.modules.ticket.mapper.TicketMapper;
import ticketnow.modules.common.mapper.image.ImageMapper; 
@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService {

	/** MyBatis Mapper (DB CRUD) */
	private final TicketMapper ticketMapper;

	// 공통 이미지 업로드 서비스
	private final FileService fileService;
	
	// 티켓 대표 이미지 조회용 Mapper
	private final ImageMapper imageMapper;

	// =================================================================================
	// 생성
	// =================================================================================
	@Override
	@Transactional
	public TicketResponseDTO createTicket(TicketCreateRequestDTO req) {
		final long t0 = System.nanoTime(); // 경과시간 측정(성능 확인용)
		log.debug("[Ticket][CREATE][REQ] {}", req); // 입력 파라미터 스냅샷

		// 방어 로직: 날짜가 null이면 바로 예외 (NPE 방지)
		   if (req.getStartAt() == null || req.getEndAt() == null) {
		        log.error("[Ticket][CREATE] startAt/endAt is null. req={}", req);
		        throw new IllegalArgumentException("공연 시작/종료 일시가 올바르지 않습니다.");
		    }

		   
		// 현재 시각 기준으로 초기 상태 결정:
		// 시작 전: SCHEDULED
		// 시작 시각 경과: ON_SALE (좌석/판매조건에 따라 추가 정책 가능)
		// 시작시간 기준으로 기본 상태 보정
		final TicketStatus status = LocalDateTime.now().isBefore(req.getStartAt()) ? TicketStatus.SCHEDULED
				: TicketStatus.ON_SALE;

		// TicketVO를 거치지 않고 Map 파라미터로 INSERT 수행
		// 장점: VO 게터/세터 의존 제거, 동적 필드/부분 갱신에 유연
		Map<String, Object> p = new HashMap<>();
		p.put("title", req.getTitle());
		p.put("startAt", req.getStartAt());
		p.put("endAt", req.getEndAt());
		p.put("venueName", req.getVenueName());
		p.put("category", req.getCategory());
		p.put("venueAddress", req.getVenueAddress());
		p.put("totalSeats", req.getTotalSeats());
		p.put("remainingSeats", req.getTotalSeats()); // 디폴트: 남은 좌석 = 총좌석
		p.put("price", req.getPrice());
		p.put("ticketDetail", req.getTicketDetail());
		p.put("ticketStatus", status.name());

		log.debug("[Ticket][CREATE][BEFORE] params={}", p); // INSERT 전 파라미터 확인
		int rows = ticketMapper.insertTicketFromMap(p); // ★ keyProperty로 ticketId 채워짐
		log.info("[Ticket][CREATE] rows={}, newId={}", rows, p.get("ticketId"));

		// MyBatis useGeneratedKeys로 주입된 PK를 안전하게 꺼냄
		Long newId = (p.get("ticketId") instanceof Number) ? ((Number) p.get("ticketId")).longValue() : null;

		// ★ 추가: 티켓 생성 시 이미지가 같이 넘어온 경우, 공통 FileService로 업로드
		if (newId != null && req.getImages() != null && !req.getImages().isEmpty()) {
			try {
				// 1) ImageListDTO 구성 (어느 티켓의 이미지인지 지정)
				ImageListDTO imageReq = ImageListDTO.builder()
				        .ticketId(newId) // ticket FK
				        .build();

				// newImages 리스트 생성
				List<NewImageDTO> newImages = new ArrayList<>();

				int sort = 1;
				for (MultipartFile file : req.getImages()) {
				    if (file == null || file.isEmpty()) {
				        continue; // 빈 파일은 스킵
				    }

				    newImages.add(
				            NewImageDTO.builder()
				                    .file(file)
				                    .isPrimary(sort == 1)     // 첫 번째 이미지를 대표로 설정
				                    .imageSort(sort)          // 정렬 순서 1,2,3...
				                    .imageType("TICKET_IMAGE") // ★ 티켓 이미지 타입 명시
				                    .build()
				    );
				    sort++;
				}

				imageReq.setNewImages(newImages);

				if (!newImages.isEmpty()) {
				    List<ImageVO> images = fileService.upsertImages(imageReq);
					log.debug("[Ticket][CREATE][IMAGE] uploaded {} images for ticketId={}",
							images != null ? images.size() : 0, newId);
				} else {
					log.debug("[Ticket][CREATE][IMAGE] no valid image files to upload for ticketId={}", newId);
				}

			} catch (IOException e) {
				// 파일 처리 예외는 IllegalStateException으로 래핑해서 전파
				log.error("[Ticket][CREATE][IMAGE] 이미지 업로드 중 오류 발생 ticketId={}", newId, e);
				throw new IllegalStateException("티켓 이미지 저장 중 오류가 발생했습니다.", e);
			}
		} else {
			log.debug("[Ticket][CREATE][IMAGE] no images in request or ticketId is null.");
		}

		// 최종 저장본을 DTO로 재조회하여 응답 (응답 일관성 보장)
		TicketResponseDTO saved = ticketMapper.selectTicketDTOById(newId);
		log.debug("[Ticket][CREATE][AFTER] {}", saved);
		log.debug("[Ticket][CREATE] elapsed={} ms", (System.nanoTime() - t0) / 1_000_000.0);

		// [DEBUG TIP] 좌석 합계/잔여 수 논리 검증이 필요하면 여기서 assert/log 추가 가능
		return saved;
	}

	// =================================================================================
	// 단건
	// =================================================================================
	@Override
	@Transactional(readOnly = true)
	public TicketResponseDTO getTicket(Long ticketId) {
		final long t0 = System.nanoTime();
		log.debug("[Ticket][GET] id={}", ticketId);

		// DTO로 직접 조회 (컨트롤러 응답과 동일 스키마)
		TicketResponseDTO dto = ticketMapper.selectTicketDTOById(ticketId);
		if (dto == null) {
			// 존재하지 않으면 도메인 예외(여기서는 IllegalStateException 사용)
			log.warn("[Ticket][GET] not found id={}", ticketId);
			 throw new IllegalArgumentException("티켓을 찾을 수 없습니다: id=" + ticketId);
		}
		 // 대표 이미지 1장(primary) 조회 → mainImageUrl 설정
	    ImageVO primary = imageMapper.selectPrimaryImageByTicket(ticketId);
	    if (primary != null) {
	        dto.setMainImageUrl(primary.getImgUrl());
	    }
		
		//   상품 설명용 이미지(detailImageUrl) 설정
	    // - 같은 티켓의 모든 이미지를 가져와서
	    //   대표이미지가 아닌 것 중 첫 번째를 detailImageUrl로 사용
	    List<ImageVO> images = imageMapper.selectImagesByTicket(ticketId);
	    if (images != null && !images.isEmpty()) {
	        images.stream()
	                .filter(img -> primary == null 
	                        || !Objects.equals(img.getImageUuid(), primary.getImageUuid()))
	                .findFirst()
	                .ifPresent(detail -> dto.setDetailImageUrl(detail.getImgUrl()));
	    }


		log.debug("[Ticket][GET] elapsed={} ms", (System.nanoTime() - t0) / 1_000_000.0);
		return dto;
	}

	// =================================================================================
	// 페이지
	// =================================================================================
	@Override
	@Transactional(readOnly = true)
	public PageResponseDTO<TicketResponseDTO> getTicketPage(PageRequestDTO pageReq) {
		final long t0 = System.nanoTime();

		// 페이지 파라미터 보정(1-base page, 최소 size=1)
		int page = Math.max(1, pageReq.getPage());
		int size = Math.max(1, pageReq.getSize());
		int offset = (page - 1) * size;

		log.debug("[Ticket][PAGE] page={}, size={}, offset={}", page, size, offset);

		// 목록은 DTO로 직접 조회 (프리젠테이션 스키마에 딱 맞춤)
		List<TicketResponseDTO> rows = ticketMapper.selectTicketDTOPage(offset, size);
		long total = ticketMapper.countTickets();

		//  각 항목에 대표 이미지 URL 주입
		if (rows != null) {
		    for (TicketResponseDTO dto : rows) {
		        ImageVO primary = imageMapper.selectPrimaryImageByTicket(dto.getTicketId());
		        if (primary != null && primary.getImgUrl() != null) {
		            dto.setMainImageUrl(primary.getImgUrl());
		        } else {
		            dto.setMainImageUrl(""); // 없으면 프론트에서 기본 이미지 사용
		        }
		    }
		}


	    // 표준 페이징 응답 조립
	    PageResponseDTO<TicketResponseDTO> resp = new PageResponseDTO<>();
	    resp.setList(rows);
	    resp.setTotalCount(total);
	    resp.setPage(page);
	    resp.setSize(size);

	    log.debug("[Ticket][PAGE] total={}, totalPages={}, fetched={}", total, resp.getTotalPages(), rows.size());
	    log.debug("[Ticket][PAGE] elapsed={} ms", (System.nanoTime() - t0) / 1_000_000.0);
	    return resp;
	}

	// =================================================================================
	// 수정
	// =================================================================================
	@Override
	@Transactional
	public TicketResponseDTO updateTicket(Long ticketId, TicketUpdateRequestDTO req) {
		final long t0 = System.nanoTime();
		log.debug("[Ticket][UPDATE][REQ] id={}, req={}", ticketId, req);

		// 선 존재확인 (낙관적 업데이트 / 예외 메시지 일관성 유지)
		if (ticketMapper.selectTicketDTOById(ticketId) == null) {
			log.warn("[Ticket][UPDATE] not found id={}", ticketId);
			throw new IllegalStateException("티켓이 존재하지 않습니다: " + ticketId);
		}

		// 부분 갱신을 위해 Map으로 전달(null 필드는 XML에서 무시)
		Map<String, Object> p = new HashMap<>();
		p.put("ticketId", ticketId);
		p.put("title", req.getTitle());
		p.put("startAt", req.getStartAt());
		p.put("endAt", req.getEndAt());
		p.put("venueName", req.getVenueName());
		p.put("venueAddress", req.getVenueAddress());
		p.put("totalSeats", req.getTotalSeats());
		p.put("remainingSeats", req.getRemainingSeats());
		p.put("price", req.getPrice());

		if (req.getTicketStatus() != null) {
			// ENUM 유효성은 컨트롤러/서비스단에서 미리 검증하거나 DB 제약으로 보완 가능
			p.put("ticketStatus", req.getTicketStatus()); // 문자열 그대로(ENUM 체크는 XML/DB 제약 혹은 서비스단 validation 로커버)
		}

		int rows = ticketMapper.updateTicketFromMap(p);
		log.info("[Ticket][UPDATE] rows={}", rows);
		
		// 4️⃣ 이미지 수정 로직 추가
	    if (req.getImages() != null && !req.getImages().isEmpty()) {
	        try {
	            // 기존 이미지 삭제 + 새 이미지 업로드 구조라면 ImageListDTO 사용
	            ImageListDTO imageReq = ImageListDTO.builder()
	                    .ticketId(ticketId)
	                    .build();

	            List<NewImageDTO> newImages = new ArrayList<>();
	            int sort = 1;
	            for (MultipartFile file : req.getImages()) {
	                if (file == null || file.isEmpty()) continue;

	                newImages.add(
	                        NewImageDTO.builder()
	                                .file(file)
	                                .isPrimary(sort == 1) // 첫 번째 이미지를 대표로 설정
	                                .imageSort(sort)
	                                .imageType("TICKET_IMAGE") // ★ 티켓 이미지 타입 명시
	                                .build()
	                );
	                sort++;
	            }


	            imageReq.setNewImages(newImages);

	            if (!newImages.isEmpty()) {
	                List<ImageVO> uploaded = fileService.upsertImages(imageReq);
	                log.debug("[Ticket][UPDATE][IMAGE] updated {} images for ticketId={}",
	                        uploaded != null ? uploaded.size() : 0, ticketId);
	            }
	        } catch (IOException e) {
	            log.error("[Ticket][UPDATE][IMAGE] 이미지 업로드 중 오류 ticketId={}", ticketId, e);
	            throw new IllegalStateException("티켓 이미지 수정 중 오류가 발생했습니다.", e);
	        }
	    } else {
	        log.debug("[Ticket][UPDATE][IMAGE] no new images in request for ticketId={}", ticketId);
	    }

		// 갱신본 재조회 후 반환
		TicketResponseDTO updated = ticketMapper.selectTicketDTOById(ticketId);
		log.debug("[Ticket][UPDATE][AFTER] {}", updated);
		log.debug("[Ticket][UPDATE] elapsed={} ms", (System.nanoTime() - t0) / 1_000_000.0);

		// [DEBUG TIP] 좌석 값(total vs remaining) 일관성 체크 로깅 포인트
		return updated;
	}

	// =================================================================================
	// 삭제
	// =================================================================================
	@Override
	@Transactional
	public void deleteTicket(Long ticketId) {
	    final long t0 = System.nanoTime();
	    log.debug("[Ticket][DELETE] id={}", ticketId);

	    // 1) 티켓에 연결된 이미지 먼저 삭제
	    fileService.deleteAllByTicketId(ticketId);

	    // 2) 티켓 하드 삭제
	    int rows = ticketMapper.hardDeleteTicket(ticketId);
	    log.info("[Ticket][DELETE] hard delete rows={}, id={}", rows, ticketId);

	    log.debug("[Ticket][DELETE] elapsed={} ms", (System.nanoTime() - t0) / 1_000_000.0);
	}
}
